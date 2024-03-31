"use client"
import ImageViewer from '@/components/image-viewer';
import Loading from '@/components/loading';
import TopNav from '@/components/top-nav';
import { listAllObjects } from '@/s3/s3-functions'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [next, setNext] = useState<string>()
  const [loadMore, setLoadMore] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const response = await listAllObjects({continueToken: next})
      setImageUrls([
        ...imageUrls, ...response.imageUrls
      ])
      setNext(response.continueToken)
      setLoading(false)
    }
    fetchImages()
  }, [loadMore])
  

  return (
    <>
    <TopNav/>
    <div className="container mx-auto bg-slate-50 pb-24 md:pb-8 md:pt-28 px-8 md:px-28">
      <div className="grid grid-cols-min sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> 
        {imageUrls.map((url, index) => (
          <ImageViewer key={index} url={url} index={index} />
        ))}
      </div>
      {
        loading && 
        <div className=' w-full h-56 flex justify-center items-center'>
          <Loading/>
        </div>
      }
      {
        (imageUrls.length === 0 && !loading) && <p className="text-center h-56 flex justify-center items-center text-3xl font-bold mt-4">No Images Found</p>
      }
      {
        next && <button onClick={() => setLoadMore(!loadMore)} disabled={loading} className=" h-14 bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-white font-bold py-2 px-4 rounded mt-4 w-full">
           {loading ? <Loading/> : 'Load More'}
          </button>
      }
    </div>
    </>
    
);
}

export default Page