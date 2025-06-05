import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("Server activated successfully");
  const res = NextResponse.json({ message: "Server activated successfully"});
  return res;
}
