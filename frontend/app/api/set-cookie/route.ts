import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { accessToken } = await req.json();
  const response = NextResponse.json({ success: true });
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 15,
  });
  console.log("✅ accessToken cookie set");
  return response;
}