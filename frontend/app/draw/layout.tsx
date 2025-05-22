

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'

export default async function DrawLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('accessToken')?.value;
  if (!token) {
    redirect('/login'); 
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (err) {
    redirect('/login');
  }

  return <>{children}</>;
}