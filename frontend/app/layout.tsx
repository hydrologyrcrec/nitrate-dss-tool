// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: "Range AI",
  icons: {
    icon: "/icon.ico", // This is required
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}