"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState} from 'react'
import Webcam from 'react-webcam'


function Interview({params}) {

    const [interviewData, setInterviewData]= useState();
    const [webCamEnabled, setWebCamEnabled]= useState(false);
    useEffect(() => {
        getInterviewDetails();
        
    }, )

    const getInterviewDetails = async () => {
            const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewID));
            setInterviewData(result[0])
    }


  return (
    <div className='my-10 '>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div className='grid grid-cols-1  md:grid-cols-2 gap-10'>
        
        <div className='flex flex-col my-5 gap-5'>
        <div className='p-5 rounded-lg border'>
        <h2 className='text-lg'><strong>Job Role/Position:</strong> {interviewData ? interviewData.jobPosition : 'Loading...'}</h2>
        <h2 className='text-lg'><strong>Job Description:</strong> {interviewData ? interviewData.jobDescription : 'Loading...'}</h2>
        <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData ? interviewData.jobExperience : 'Loading...'}</h2>
        </div>
        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
            <h2 className='mt-3 text-black'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>
        </div>
        <div>
            {webCamEnabled?<Webcam 
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{
                height: 400,
                width: 450,
            }}
            />
            :
            <>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
            <Button onClick={() => setWebCamEnabled(true)} className=' mb-3 bg-purple-500 hover:bg-purple-300 w-full'>Enable Web Camera and Microphone</Button>
            </>
            }
        </div>

        </div>
        <div className='flex justify-end items-end'>     
        <Button className='mt-2 text-white bg-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Start Interview</Button>
        </div>  

     </div>
  )
}

export default Interview