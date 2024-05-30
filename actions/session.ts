"use server"
import { decryptData } from "@/utils/encryption"
import { kv } from "@vercel/kv"
import { cookies } from "next/headers"

const checkUserSession = async () =>  {
    try{
        const cookieStore = cookies()
        const sessionCookie = cookieStore.get("session")
        if(!sessionCookie){
            return "invalid_session"
        }
        const decryptedSessionId = decryptData(sessionCookie?.value)
        const sessionData: any = await kv.get(decryptedSessionId)
        if(!sessionData){
            return "invalid_session"
        }
        if(sessionData && new Date().getTime() > (sessionData?.lastRequest + sessionData?.expiry)){
            kv.del(decryptedSessionId)
            return "session_timeout"
        }
        return "success"
    } catch(err){
        console.log(err)
        return "error"
    }
}

export {
    checkUserSession
}