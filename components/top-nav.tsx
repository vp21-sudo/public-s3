"use client"
import Image from 'next/image'
import React from 'react'
import UploadIcon from '@mui/icons-material/Upload';
import Link from 'next/link';

const TopNav = () => {
  return (
    <div className=' fixed left-0 bottom-5 md:top-5  w-full h-fit flex justify-center items-center z-50'>
        <div className=' flex justify-between items-center h-16 md:h-20 px-2 md:px-2 md:pe-8 pe-4 rounded-full w-11/12 md:w-10/12 bg-teal-300 z-50 shadow-xl'>
        <div className=' flex justify-center items-center'>
        <Image
            src="/VP.png"
            alt="logo"
            width={200}
            height={200}
            className=' w-12 h-12 md:w-16 md:h-16 rounded-full '
        />
        <p className=' font-bold text-xl md:text-3xl px-1 md:px-2 text-teal-800'>Public-S3</p>
        </div>
        <div>
            <Link href='/upload' className=' font-bold text-xl md:text-3xl flex justify-center bg-blue-400 hover:bg-blue-600 transition-all ease-in-out duration-200 p-2 rounded-xl shadow-md hover:shadow-slate-500 shadow-slate-600 text-slate-100 items-center'>
                <p className=' px-1 md:px-2 text-2xl'>Upload</p>
                <UploadIcon className=' border-2 rounded-full border-slate-100' />
            </Link>
        </div>
    </div>
    </div>
  )
}

export default TopNav