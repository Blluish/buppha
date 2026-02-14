import { NextRequest, NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const callbackUrl = searchParams.get("state") || "/";

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Google token error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
    }

    // Get user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userInfoRes.json();
    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=no_email", request.url));
    }

    // Find or create user in database
    await initializeDb();
    const sql = getDb();

    const existingRows = await sql`SELECT * FROM users WHERE email = ${googleUser.email}`;

    let userId: string;
    let role: string;
    let name: string;

    if (existingRows.length > 0) {
      // User exists - update their Google info
      const existing = existingRows[0];
      userId = existing.id;
      role = existing.role;
      name = existing.name;

      // Update image if they logged in with Google
      if (googleUser.picture) {
        await sql`UPDATE users SET image = ${googleUser.picture}, provider = 'google' WHERE id = ${userId}`;
      }
    } else {
      // Create new user
      userId = uuidv4();
      role = "customer";
      name = googleUser.name || googleUser.email.split("@")[0];

      await sql`INSERT INTO users (id, email, password, name, role, image, provider)
        VALUES (${userId}, ${googleUser.email}, ${null}, ${name}, 'customer', ${googleUser.picture || null}, 'google')`;
    }

    // Issue JWT token (same as regular login)
    const token = signToken({ userId, email: googleUser.email, role });
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url));
  }
}
