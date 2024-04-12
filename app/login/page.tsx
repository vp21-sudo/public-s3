"use client"
import { checkUserSession } from '@/actions/session';
import Loading from '@/components/loaders';
import Login from '@/components/login-registration/login';
import TopNav from '@/components/top-nav';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()
  // make the server action call to validate session
  const [laoding, setLaoding] = useState(true);
  useEffect(() => {
    const checkSession = async () => {
      const session = await checkUserSession();
      if (session === 'success') {
        router.replace("/upload")
      }
    };
    setLaoding(false)
    // Immediately call the async function
    checkSession();
  }, [router]);
  return (
    laoding ? <div className=" w-full h-screen flex justify-center items-center"><Loading /></div> :
      <div className=' w-full h-fit flex justify-center items-center'>
        <TopNav showUpload={false} />
        <Login />
      </div>

  )
}

export default Page