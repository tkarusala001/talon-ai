"use client"
import React from 'react'
import { useState } from "react";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

  

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState()
    const [jobDescription, setJobDescription] = useState()
    const [jobExperience, setJobExperience] = useState()

    const onSubmit = (e)=>{
      e.preventDefault();
      console.log(jobPosition, jobDescription, jobExperience)
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=> setOpenDialog(true)}>
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
              <Input placeholder='Ex. Full Stack Developer' required/>
              onChange={(event) =>setJobPosition(event.target.value)}
            </div>
            <div className='my-3'>
              <label>Job Description/Tech Stack (short)</label>
              <Textarea placeholder='Ex. Node.js, Angular.js, Python, PostgreSQL, etc.' required/>
              onChange={(event) =>setJobDescription(event.target.value)}
            </div>
            <div className='my-3'>
              <label>Years of Experience</label>
              <Input placeholder='Ex. 5' type="number" max="50" required/>
              onChange={(event) =>setJobExperience(event.target.value)}
            </div>
          </div>
          <div className='flex gap-5 justify-end'>
            <Button type="button" variant="ghost" onClick={()=> setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" className='bg-purple-600 hover:bg-purple-400'>Start Interview</Button>
          </div>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>

    </div>
  )
}

export default AddNewInterview