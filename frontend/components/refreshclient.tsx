'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/components/ApiUrl';

export default function RefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    console.log("⚡ Refresh page mounted");
    const refresh = async () => {
      try {
        const response = await apiUrl.post('/api/auth/refresh-token')
        if (!response.data.accessToken) {
            router.push("/")
        }

        const res = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            accessToken: response.data.accessToken,
          })
        });

        const responseData = await res.json();

        if (res.ok && responseData.authenticated) {
            router.replace(redirect);
          } else {
            router.replace("/");
          }
      } catch (err) {
        console.error("❌ Refresh request failed:", err);
        router.replace("/");
      }
    };

    refresh();
  }, [redirect, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Refreshing your session...</p>
    </div>
  );
}
