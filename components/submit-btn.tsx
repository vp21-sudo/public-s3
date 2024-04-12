"use client"

import React from 'react'
import { useFormStatus } from 'react-dom'
import Loading from './loaders'

interface Props{
    text?: string
}

const Submit = ({text="Submit"}: Props) => {
    const { pending, } = useFormStatus()

    return (
        <button disabled={pending} className=' w-full h-14 py-4 md:py-2 font-medium px-8 md:px-16 rounded-lg flex justify-center items-center hover:bg-blue-600 transition-all ease-in-out duration-200 border-2 border-slate-50 bg-blue-500 text-slate-50 mb-4 text-lg md:text-3xl'>
            {
                pending ? <Loading size={30} /> : text
            }
        </button>
    )
}

export default Submit