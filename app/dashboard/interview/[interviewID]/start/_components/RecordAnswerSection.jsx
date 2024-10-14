"use client"
import Webcam from 'react-webcam'
import React, {useEffect, useState} from 'react'
import  Image  from 'next/image'
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';


function RecordAnswerSection() {
  const [userAnswer, setUserAnswer] = useState('');
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

  const SaveUserAnswer = ()=> {
    if (isRecording) {
      stopSpeechToText();
    }
    else {
      startSpeechToText();
    }
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
                variant='outline'
                className='my-10 flex items-center gap-2'
                onClick={SaveUserAnswer}
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

          <Button className='bg-purple-400 flex gap-2 justify-center items-center' onClick={()=> console.log(userAnswer)}>Show User Answer</Button>
          

    </div>
  )
}

export default RecordAnswerSection