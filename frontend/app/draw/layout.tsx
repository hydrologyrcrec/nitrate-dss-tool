import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'

export default async function DrawLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    if (!token) {
        console.log("No token found, redirecting...")
        redirect('/login')
    }
    try {
        const truth = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
        if (!truth) {
            console.log("Invalid token, redirecting...")
        redirect('/login')
        }
        return <>{children}</>
    } catch (err) {
        console.log("Error verifying token:", err)
        redirect('/login')
    }
}