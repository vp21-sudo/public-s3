import React from 'react'

interface Props {
    size?: number
    color?: string
}
const Loading = ({ size = 40 }: Props) => {
    return (
        <div className=' w-full h-full flex justify-center items-center'>
            <div className={`animate-spin rounded-full border-4 border-t-slate-800 border-t-transparent`} style={{ width: size, height: size }}>
            </div>
        </div>
    );
}

export default Loading