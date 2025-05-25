import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("🔁 /api/refresh route HIT");

  const { accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json({
      authenticated: false,
      message: "Access token not found",
    }, { status: 400 });
  }

  const res = NextResponse.json({ authenticated: true, message: "Token set" });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15
  });

  return res;
}
