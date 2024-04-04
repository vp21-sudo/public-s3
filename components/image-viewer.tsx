"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import CopyToClipboard from './copy-to-clipboard'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import Link from 'next/link'

interface Props {
    url: string,
    index: number
}
const ImageViewer = ({ url, index }: Props) => {
    const [loading, setLoading] = useState(true)
    return (
        <div key={index} className="relative group aspect-w-16 aspect-h-9 bg-transparent hover:scale-110 hover:z-40 group-hover:rounded-full transition-all ease-in-out duration-300 "> {/* Adjust aspect ratio as needed */}
            <div className=' absolute w-full h-full group-hover:flex justify-around items-center hidden  group-hover:backdrop-blur-sm transition-all ease-in-out duration-300'>
                <div className=' w-full h-full opacity-100 flex flex-col justify-center gap-10 items-center z-20 text-3xl transition-all ease-in-out duration-300'>
                    <Link href={url} target='_blank' className=' bg-blue-600 hover:bg-blue-700 transition-all ease-in-out duration-300 py-2 px-4 rounded-xl hover:cursor-pointer font-medium text-slate-100 flex justify-center items-center'>
                        <p className=' px-1 md:px-2 text-sm md:text-3xl'>Open Link</p>
                        <ArrowOutwardIcon className=' text-lg md:text-3xl' />
                    </Link>
                    <CopyToClipboard url={url}  />
                </div>
            </div>
            <Image
                src={url}
                width={300}
                height={300}
                alt={url || `Image ${index}`}
                className={' w-full h-96 object-cover rounded-2xl border-2 shadow-lg shadow-black' + (loading ? ' blur-sm animate-pulse bg-slate-700 ' : ' ')}
                onLoad={() => { setLoading(false) }}
            />
            </div>
    )
}

export default ImageViewer