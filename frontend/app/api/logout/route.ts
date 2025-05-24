// app/api/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  // Trigger Flask to clear its cookies
  await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5008"}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  // Clear cookies from Next.js domain
  const res = NextResponse.json({ success: true });
  res.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}