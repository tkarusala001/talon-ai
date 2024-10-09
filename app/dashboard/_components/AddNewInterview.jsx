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

  

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=> setOpenDialog(true)}>
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
    
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
          <div className='flex gap-5 justify-end'>
            <Button variant="ghost" onClick={()=> setOpenDialog(false)}>Cancel</Button>
            <Button className='bg-purple-600 hover:bg-purple-400'>Start Interview</Button>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>

    </div>
  )
}

export default AddNewInterview