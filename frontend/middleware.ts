import { NextResponse, NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");

  if (!accessToken) {
    console.log("No access token. Redirecting to refresh...");
    const refreshingUrl = new URL('/refresh', req.url);
    refreshingUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(refreshingUrl);
  }
  console.log("Token found, continuing...");
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
