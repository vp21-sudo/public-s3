"use client"

import React from 'react'
import { useFormStatus } from 'react-dom'
import Loading from './loaders'

const Submit = () => {
    const { pending, } = useFormStatus()

    return (
        <button disabled={pending} className=' w-full md:w-1/5 mt-4 p-2 h-14 md:h-8 py-4 md:py-6 rounded-lg flex justify-center items-center hover:bg-blue-800 transition-all ease-in-out duration-200 border-2 border-slate-50 bg-blue-600 text-slate-50 mb-4 text-lg md:text-2xl'>
            {
                pending ? <Loading size={30} /> : "Submit"
            }
        </button>
    )
}

export default Submit