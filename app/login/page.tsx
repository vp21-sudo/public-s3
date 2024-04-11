"use client"
import Login from '@/components/login-registration/login';
import TopNav from '@/components/top-nav';
import { useAuth } from '@/context/auth';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const Page = () => {
    // const {isLoggendIn, setIsLoggendIn} = useAuth()
    // useEffect(() => {
    //   isLoggendIn && redirect("/upload")
    // }, [isLoggendIn]);
  return (
    <div className=' w-full h-fit flex justify-center items-center'>
      <TopNav showUpload={false} />
      <Login/>
    </div>
  )
}

export default Page