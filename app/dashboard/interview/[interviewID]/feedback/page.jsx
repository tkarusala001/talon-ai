"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function Feedback({ params }) {

  const [feedbackList, setFeedbackList] = useState([])
  const [averageRating, setAverageRating] = useState(0); // New state for the average rating
  const router = useRouter();

  useEffect(() => {
    console.log(params);
    GetFeedback();
  }, [])

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewID))
      .orderBy(UserAnswer.id)
    
    setFeedbackList(result);

    // Calculate average rating once feedback is retrieved
    const totalRating = result.reduce((acc, item) => acc + Math.min(Math.max(item.rating, 0), 10), 0); // Ensure each rating is between 0 and 10
    const avgRating = totalRating / result.length || 0; // Calculate the average, default to 0 if no feedback
    setAverageRating(Math.round(avgRating)); // Set the average rating as a whole number
  }

  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-600 mb-1'>Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is Your Interview Feedback: </h2>
      
      {/* Dynamically display the calculated average rating as a whole number */}
      <h2 className='text-purple-500 text-lg my-3'>Your Interview Rating: <strong>{averageRating}/10</strong></h2>

      <h2 className='text-sm text-gray-500'>Find the interview questions, ideal answers, your answers, and feedback for each question below</h2>
      
      {feedbackList && feedbackList.map((item, index) => (
        <Collapsible key={index} className='mt-7'>
          <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
            {item.question} <ChevronsUpDown className='h-5 w-5' />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2'>
              <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating: </strong>{item.rating}</h2>
              <h2 className='p-2 border rounded-lg bg-purple-50 text-sm text-purple-950'><strong>Your Answer: </strong>{item.userAns}</h2>
              <h2 className='p-2 border rounded-lg bg-green-200 text-sm text-green-950'><strong>Ideal Answer: </strong>{item.idealAnswer}</h2>
              <h2 className='p-2 border rounded-lg bg-blue-200 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      <Button onClick={() => router.replace('/dashboard')} className='bg-purple-500 hover:bg-purple-300 mt-4 mb-5'>
        Go to Home
      </Button>
      
    </div>
  )
}

export default Feedback;
