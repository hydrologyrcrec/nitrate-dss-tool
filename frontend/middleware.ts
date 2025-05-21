import { NextResponse, NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")
  if (!accessToken) {
    console.log("No Authorization header found, redirecting...");
    const redirectUrl = new URL('/login', req.url); 
    return NextResponse.redirect(redirectUrl);
  } else {
    console.log("Token found, continuing...");
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/draw'],
};