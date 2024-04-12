"use client"
import { checkUserSession } from "@/actions/session";
import Loading from "@/components/loaders";
import Upload from "@/components/upload";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  // make the server action call to validate session
  useEffect(() => {
    const checkSession = async () => {
      const session = await checkUserSession();
      if (session !== 'success') {
        router.replace("/login")
      }
      setLoading(false)
    };
    // Immediately call the async function
    checkSession();
  }, [router]);
  return (
    loading ? <div className=" w-full h-screen flex justify-center items-center"><Loading /></div> : <Upload />
  )

};

export default Page;
