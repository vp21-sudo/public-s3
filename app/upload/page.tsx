"use client"
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { uploadImageAction } from '../api/actions';
import { useFormState } from 'react-dom';
import Submit from '@/components/submit-btn';
import { toast } from 'react-toastify';

const Upload = () => {

  const initialState = {
    message: '',
    error: false
  }
  const [state, formAction] = useFormState<any, FormData>(uploadImageAction, initialState)
  const uploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile.name);
      generatePreview(selectedFile);
    }
  };

  if(state?.error && state?.message?.length > 0 ){
    toast.error(state.message)
  }

  if(!state?.error && state?.message?.length > 0){
    toast.info(state.message)
  }

  const handleUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setFileType("droptext");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile.name);
      generatePreview(droppedFile);

    }
  };

  const generatePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileType(file.type);
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderPreview = () => {
    switch (fileType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return <Image src={previewUrl!} alt="Preview" width={300} height={300} className="w-full h-full object-cover" />;
      case 'application/pdf':
        return <embed src={previewUrl!} type="application/pdf" className="w-full h-full" />;
      case 'text/plain':
        // Rendering text file as plain text
        return <textarea value={previewUrl!} readOnly className="w-full h-full" />;
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'text/csv':
        // Rendering Excel file as an external viewer or a downloadable link
        return (
          <div className="w-full h-full z-0">
            <a href={previewUrl!} target="_blank" rel="noopener noreferrer">View Excel file</a>
          </div>
        );
      case 'droptext':
        return <p className='text-slate-400'>Drop the file</p>;
      default:
        return <p className='text-slate-400'>Click to Add Image</p>;
    }
  };

  return (
    <div className=' w-full h-screen flex flex-col justify-center items-center'>
      <div
        onClick={handleUpload}
        className='w-80 h-56 border-2 rounded border-slate-200 flex justify-center items-center hover:cursor-pointer z-10'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setFileType("")}
      >
        <div className=' w-full h-full flex justify-center items-center z-0'>
          {renderPreview()}
        </div>
      </div>
      <form action={formAction} className=' w-full flex flex-col justify-center items-center'>
        <input type="file" name='file' className='hidden' ref={uploadRef} onChange={handleFileChange} />
        <div className=' px-4 w-full flex justify-center items-center'>
          <Submit />
        </div>
      </form>
      <p className='text-slate-400 text-xl py-4 px-8'>Note: Only images are allowed and max size is <b>4.5MB </b>
        <br />All images uploaded will be <b className=' uppercase'>publicaly available</b>
      </p>
    </div>
  );
};

export default Upload;
