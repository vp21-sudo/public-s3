"use client"
import React, { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

interface Props {
    url: string,
}

const CopyToClipboard = ({ url }: Props) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
    }
    return (
        <button onClick={handleCopy} className=' bg-blue-600 hover:bg-blue-700 transition-all ease-in-out duration-300 py-2 px-4 rounded-xl hover:cursor-pointer font-medium text-slate-100 flex justify-center items-center'>
            <p className=' px-1 md:px-2 text-sm md:text-3xl'>Copy Link</p>
            {copied ? <DoneIcon className=' text-lg md:text-3xl' /> : <ContentCopyIcon className=' text-lg md:text-3xl' />}
        </button>
    )
}

export default CopyToClipboard