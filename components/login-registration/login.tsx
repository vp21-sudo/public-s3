"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams, redirect } from 'next/navigation'
import Submit from '../submit-btn'
import { useFormState } from 'react-dom'
import { handleLoginForm } from '@/actions/login'
import { toast } from 'react-toastify'
import { handleRegistrationForm } from '@/actions/registraction'
import { handleResendEmail } from '@/actions/resend-email'


const Login = () => {
    const router = useRouter()
    const params = useSearchParams()
    const [activeTab, setActiveTab] = useState<boolean>(true)
    const [showVerify, setshowVerify] = useState<boolean>(false);

    const handleTabChange = (isLogin: boolean) => {
        setActiveTab(isLogin)
    }

    useEffect(() => {
      const emailVerificationStatus = params.get("email_verified")
      if(emailVerificationStatus === "true"){
        toast.success("Email verfied, Please login.")
      }
      if(emailVerificationStatus === "already_verified"){
        toast.info("Email is already verified, Please login.")
      }
    }, [params]);


    const bgPosition = activeTab ? '0%' : '50%';

    return (
        <div className=' flex flex-col mt-16 md:mt-24 justify-center items-center h-full w-full bg-transparent gap-5 pt-16'>
            <div className=' w-5/6 md:w-1/4 h-16 rounded-full flex justify-center items-center bg-blue-200 dark:bg-blue-900  border-slate-950 '>
                <div className=' relative text-xl h-full text-center rounded-full py-2 dark:text-slate-800 font-semibold flex justify-around items-center w-full '>
                    <button onClick={() => handleTabChange(true)} className=' z-10 w-full h-full text-slate-950 dark:text-slate-100'>Login</button>
                    <button onClick={() => handleTabChange(false)} className=' z-10 w-full h-full text-slate-950 dark:text-slate-100'>Signup</button>
                    <div className='absolute w-1/2 h-16 scale-y-95 rounded-full bg-blue-400 dark:bg-blue-800 transition-all ease-in-out duration-200 shadow-sm shadow-slate-950 ' style={{ left: bgPosition }}></div>
                </div>
            </div>
            {
                showVerify? <VerifyEmailTab setShowVerify={setshowVerify}/> :activeTab ? <LoginTab setShowVerify={setshowVerify}/> : <SignupTab setShowVerify={setshowVerify}/>
            }

        </div>
    )
}


const LoginTab = ({setShowVerify}: any) => {
    const initialState = {
        message: '',
        error: false
    }
    const [state, formAction] = useFormState<any, any>(handleLoginForm, initialState)
    useEffect(() => {
        if (state.error) {
          if (state.message.email) {
            toast.error(state.message.email[0]);
          }
          if (state.message.password) {
            toast.error(state.message.password[0]);
          }
          if(state.message?.length > 0){
            if(state.message?.toLowerCase()?.startsWith("please verify")){
               toast.error(state.message)
               setShowVerify(true)
               return
            }
            toast.error(state.message)
            return
          }
        }
        if(!state.error && state.message?.length > 0){
          toast.success("Login successful.")
          redirect("/upload")
        }
      }, [state.error, state.message.email, state.message.password, state, setShowVerify]);
    return (
        <div className=' flex justify-center items-center flex-col w-11/12 lg:w-2/5 h-3/5 py-8 md:py-24 bg-blue-200 dark:bg-blue-900 rounded-2xl shadow-2xl transition-all ease-in-out duration-200'>
            <form action={formAction} className=' w-full h-full flex flex-col justify-center items-center gap-3 text-xl p-2 px-8 md:px-20'>
                <input type="email" name='email' placeholder='Email' className=' bg-blue-100 dark:bg-blue-950 text-slate-950 dark:text-slate-100 w-full h-fit rounded-md p-2 py-3  font-medium transition-all ease-in-out duration-200 focus:border-none' />
                <input type="password" name='password' placeholder='Password' className=' bg-blue-100 dark:bg-blue-950 text-slate-950 dark:text-slate-100 w-full h-fit rounded-md p-2 py-3  font-medium transition-all ease-in-out duration-200 focus:border-none' />
                <Submit/>
            </form>
        </div>
    )
}

const SignupTab = ({setShowVerify}: any) => {
    const initialState = {
        message: '',
        error: false
    }
    const [state, formAction] = useFormState<any, any>(handleRegistrationForm, initialState)
    useEffect(() => {
        if (state.error) {
            if (state.message.username) {
                toast.error(state.message.username[0]);
              }
          if (state.message.email) {
            toast.error(state.message.email[0]);
          }
          if (state.message.password) {
            toast.error(state.message.password[0]);
          }
          if(state.message.verify){
            toast.error(state.message.verify)
            setShowVerify(true)

          }
          if(state.message.exists){
            toast.error(state.message.exists)
          }
        }
        if(!state.error && state.message.length > 0) {
          toast.success("Registered succesfufy")
          setShowVerify(true)
        }
      }, [state.error, state.message.email, state.message.password, state.message.username, state.message.verify, state.message.exists, setShowVerify, state.message.length]);
    return (
        <div className=' flex justify-center items-center flex-col w-11/12 lg:w-2/5 h-3/5 py-8 md:py-16 bg-blue-200 dark:bg-blue-900 rounded-2xl shadow-2xl transition-all ease-in-out duration-200'>
            <form action={formAction} className=' w-full h-full flex flex-col justify-center items-center gap-3 text-xl p-2 px-8 md:px-20'>
                <input  type="text" name='username' placeholder='Username' className=' bg-blue-100 dark:bg-blue-950 text-slate-950 dark:text-slate-100 w-full h-fit rounded-md p-2 py-3  font-medium transition-all ease-in-out duration-200 focus:border-none ' />
                <input  type="email" name='email' placeholder='Email' className=' bg-blue-100 dark:bg-blue-950 text-slate-950 dark:text-slate-100 w-full h-fit rounded-md p-2 py-3  font-medium transition-all ease-in-out duration-200 focus:border-none' />
                <input  type="password" name='password' placeholder='Password' className=' bg-blue-100 dark:bg-blue-950 text-slate-950 dark:text-slate-100 w-full h-fit rounded-md p-2 py-3  font-medium transition-all ease-in-out duration-200 focus:border-none' />
                <Submit/>
            </form>
        </div>
    )
}


const VerifyEmailTab =({setShowVerify}: any) => {
    const initialState = {
        message: '',
        error: false
    }
    const [state, formAction] = useFormState<any, any>(handleResendEmail, initialState)
    useEffect(() => {
      if (state.error) {
        if (state.message.email) {
          toast.error(state.message.email[0]);
        }
      } 
      if(!state.error && state.message.length > 0) {
        toast.success("Email resent succesfully")
        setShowVerify(false)
      }
    }, [state.error, state.message.email, setShowVerify, state.message.length]);
  return(
        <div className=' flex justify-center items-center flex-col w-11/12 lg:w-2/5 h-3/5 py-8 md:py-16 bg-blue-200 dark:bg-blue-900 rounded-2xl shadow-2xl transition-all ease-in-out duration-200'>
            <p>Email verification required: We have shared a verification link to your email.</p>
            <form action={formAction}>
            <input  type="email" name='email' placeholder='Email' className=' bg-blue-100 dark:bg-blue-950 text-slate-950 dark:text-slate-100 w-full h-fit rounded-md p-2 py-3 mt-4  font-medium transition-all ease-in-out duration-200 focus:border-none' />
                <Submit text="Resend Email"/>
            </form>
        </div>
    )
}

export default Login
