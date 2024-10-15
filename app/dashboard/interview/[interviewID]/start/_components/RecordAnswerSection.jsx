"use client"

import Webcam from 'react-webcam'
import React, {useEffect, useState} from 'react'
import  Image  from 'next/image'
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';


function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
  const [userAnswer, setUserAnswer] = useState('');
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=> {
    results.map((result)=> (
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    ))
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer.length > 5) {
      UpdateUserAnswer();
    }
  
  }, [userAnswer])

  const StartStopRecording = async()=> {
    if (isRecording) {
      stopSpeechToText();
     }
    else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async ()=> {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt = "Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
      ", User Answer:"+userAnswer+",Depending on user answer and question, for the given question and answer,"
      +"please give us rating for answer and feedback as area of improvement if any" + 
      "in just 3 to 5 lines to improve in JSON format with rating field and feedback field"

      const result = await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '').replace(/\*/g, '');
      console.log(mockJsonResp);
      const JsonFeedbackResp=JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        idealAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      })

      if (resp) {
        toast('Answer Recorded Successfully')
      }
      setUserAnswer('');
      setLoading(false);
    
  }
  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col justify-center items-center mt-20 bg-black rounded-lg p-5'>
            <Image src={'/webcam.png'} width={300} height={300} className='absolute'/>
            <Webcam 
            mirrored={true}
            style={{
                height: 300,
                width: 1000,
                zIndex: 10,
                borderRadius: 5,
            }}
            />
        </div>
        <Button
                disabled = {loading}
                variant='outline'
                className='my-10 flex items-center gap-2'
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <>
                        <StopCircle className='text-red-600' /> {/* Stop circle icon */}
                        <span className='text-red-600 animate-pulse'>Stop Recording</span>
                    </>
                ) : (
                    <>
                        <Mic className='text-purple-400' /> {/* Mic icon with purple color */}
                        <span className='text-purple-500'>Record Answer</span> {/* Button text with purple color */}
                    </>
                )}
            </Button>

          
          

    </div>
  )
}

export default RecordAnswerSection