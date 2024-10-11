"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { WebcamIcon } from 'lucide-react'
import React, { useEffect, useState} from 'react'
import Webcam from 'react-webcam'


function Interview({params}) {

    const [interviewData, setInterviewData]= useState();
    const [WebCamEnabled, setWebCamEnabled]= useState(false);
    useEffect(() => {
        getInterviewDetails();
    }, )

    const getInterviewDetails = async () => {
            const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewID));
            setInterviewData(result[0])
    }
    
  return (
    <div className='my-10 flex justify-center flex-col items-center'>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div>
            {WebCamEnabled? <Webcam
            onUserMedia={()=> setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{
                height:300,
                width:300
            }} />
            : 
            <>
            <WebcamIcon className='h-72 w-72 my-7 bg-secondary rounded-lg border'/>
            <Button className='bg-purple-500 hover:bg-purple-200 flex justify-center mt-4' onClick={()=> setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
            </>
        }
        </div>
        
        <div className='flex flex-col my-5 gap-5'>
        <h2 className='text-lg'><strong>Job Role/Position:</strong> {interviewData ? interviewData.jobPosition : 'Loading...'}</h2>
        <h2 className='text-lg'><strong>Job Description:</strong> {interviewData ? interviewData.jobDescription : 'Loading...'}</h2>
        <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData ? interviewData.jobExperience : 'Loading...'}</h2>
        </div>
    </div>
    
  )
}


export default Interview