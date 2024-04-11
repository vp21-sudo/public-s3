"use client"
import ImageViewer from '@/components/image-viewer';
import Loading from '@/components/loaders';
import TopNav from '@/components/top-nav';
import { listImages } from '@/db/queries/images';
// import { listAllObjects } from '@/s3/s3-functions'
import React, { useEffect, useState } from 'react'
import {toast} from 'react-toastify'

const Page = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  // const [next, setNext] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, settotalPages] = useState(0)
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const imagesList = await listImages({ page: page })
      // const response = await listAllObjects({continueToken: next})
      // setImageUrls([
      //   ...imageUrls, ...response.imageUrls
      // ])
      let mySet = new Set(imageUrls);
      settotalPages(imagesList?.total_pages || 0)
      imagesList?.updatedImages?.forEach((image) => {
        mySet.add(image.url)
      })
      setImageUrls([
        ...[...mySet]
      ])
      setLoading(false)
    }
    fetchImages()
  }, [page])
  return (
    <>
        <TopNav />
      <div className="container mx-auto bg-slate-50 pb-24 md:pb-8 md:pt-28 px-8 md:px-28">
        <div className="grid grid-cols-min sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {imageUrls.map((url, index) => (
            <ImageViewer key={index} url={url} index={index} />
          ))}
        </div>
        {
          loading &&
          <div className=' w-full h-56 flex justify-center items-center'>
            <Loading size={35} />
          </div>
        }
        {
          (imageUrls.length === 0 && !loading) && <p className="text-center h-56 flex justify-center items-center text-3xl font-bold mt-4">No Images Found</p>
        }
        {
          page < totalPages && imageUrls.length > 0 && <button onClick={() => setPage(page + 1)} disabled={loading} className=" h-14 bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-white font-bold py-2 px-4 rounded mt-4 w-full">
            {loading ? <Loading size={35} /> : 'Load More'}
          </button>
        }
      </div>
    </>

  );
}

export default Page