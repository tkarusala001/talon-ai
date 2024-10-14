"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        console.log(jobPosition, jobDescription, jobExperience);

        const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}, Depending on Job Position, Job Description, and Years of Experience, give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format, give us question and answer field on JSON`;

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const rawResponse = await result.response.text(); // Get raw response text
            console.log("Raw Response:", rawResponse);

            // Clean the response from markdown formatting
            const MockJsonResp = rawResponse.replace('```json', '').replace('```', '').replace(/\*/g, '');
            console.log("Cleaned Response:", MockJsonResp);

            // Parse the JSON response and handle errors
            let parsedJson;
            try {
                parsedJson = JSON.parse(MockJsonResp);
                console.log("Parsed JSON:", parsedJson);
            } catch (error) {
                console.error("Failed to parse JSON:", error);
                alert("There was an error parsing the interview questions. Please try again.");
                setLoading(false);
                return;
            }

            // Insert into the database if parsing was successful
            const resp = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: MockJsonResp,
                jobPosition: jobPosition,
                jobDescription: jobDescription,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy'),
            }).returning({ mockId: MockInterview.mockId });

            console.log("Inserted ID:", resp);

            if (resp) {
                setOpenDialog(false);
                router.push('/dashboard/interview/' + resp[0]?.mockId);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert("An error occurred while generating the interview. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}>
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className='max-w-xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell Us More About Your Job Interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details About Your Job Position/Role, Job Description, and Years of Experience</h2>
                                    <div className='mt-7 my-3'>
                                        <label>Job Position/Role</label>
                                        <Input
                                            placeholder='Ex. Software Engineer'
                                            required
                                            onChange={(event) => setJobPosition(event.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description/Tech Stack (short)</label>
                                        <Textarea
                                            placeholder='Ex. Node.js, Angular.js, Python, PostgreSQL, etc.'
                                            required
                                            onChange={(event) => setJobDescription(event.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input
                                            placeholder='Ex. 5'
                                            type="number"
                                            max="50"
                                            required
                                            onChange={(event) => setJobExperience(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading} className='bg-purple-600 hover:bg-purple-400'>
                                        {loading ?
                                            <>
                                                <LoaderCircle className='animate-spin' />Generating Interview
                                            </>
                                            : 'Start Interview'}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
