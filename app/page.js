"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Replace with your production signup URL
    const signupUrl = 'https://talon-ai.vercel.app/sign-in?redirect_url=https%3A%2F%2Ftalon-ai.vercel.app%2Fdashboard';
    
    // Redirect to the signup URL when the component mounts
    router.push(signupUrl);
  }, [router]);

  return (
    <div>
      {/* Other components or content */}
    </div>
  );
}
