import Image from 'next/image'
import React, { useState } from 'react'
import logo from '../../../../public/default-profile.png'
import { Textarea } from '@/components/ui/textarea'
import { addPost } from '@/app/servieces/HomePage/addPost'
import { Button } from '@/components/ui/button'
import {  useQueryClient } from '@tanstack/react-query'
import SkelatonPost from '../SkelatonPost/SkelatonPost'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updatePost } from '@/app/servieces/Posts/updatePost'
import { updateComment } from '@/app/servieces/comments/updateComment'

export default function UpdateComment({data ,  page , postId , open , onOpenChange , commentId , singlePost}:any) {
    const [postContent, setpostContent] = useState('')
    const [postIMG, setpostIMG] = useState<File | null>(null)
    const [postIMGURL, setpostIMGURL] = useState<string | null>(null)
    const [isLoading, setisLoading] = useState(false)
  const quaryclient = useQueryClient()
    async function CPostForm(){
        setisLoading(true)
        console.log('submit' , postContent);
        const formdata = new FormData()
        if (postContent.length > 0) {
            formdata.append('content', postContent)
        } else {
            formdata.append('content', ' ')
        }


        if(postIMG){
            formdata.append('image' , postIMG)
        }
        const resp = await updateComment({formdata , postId ,commentId})
        console.log('update',resp);
        if(resp.success == true){
            setpostContent('')
            setpostIMG(null)
            setpostIMGURL(null)
            onOpenChange(false) 
            if(singlePost ==true){

                quaryclient.invalidateQueries({
        queryKey: ['single post', postId],
        refetchType: 'all'
    })
    quaryclient.invalidateQueries({
        queryKey: ['single post comments', postId],
        refetchType: 'all'
    })
            }else{
                quaryclient.invalidateQueries({
                  queryKey:['get posts' , page],
                   refetchType: 'all'
                })

            }
        }
        setisLoading(false)
    }



    function handleImage(e:any){
        setpostIMG(e.target.files[0])
        setpostIMGURL(URL.createObjectURL(e.target.files[0]))
        e.target.value = ''
    }
  return (
    <>
<Dialog  open={open} onOpenChange={onOpenChange}>
         
            <DialogContent 
             onKeyDown={(e) => e.stopPropagation()}
             onInteractOutside={(e) => e.preventDefault()}
             onFocusOutside={(e) => e.preventDefault()}
             className="sm:max-w-sm"
            >          
            <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border w-full border-slate-200 bg-white p-4 shadow-sm">
            <Textarea onChange={(e)=>{setpostContent(e.target.value)}} value={postContent} placeholder={`waht's on you mind?${data ? data?.user.name: 'you'}`} className="h-20 focus-visible:ring-1 bg-gray-50 transition-colors focus-visible:bg-white focus-visible:ring-blue-400"/>
            <div className="bg-gray-300 h-0.5 w-full my-5"></div>
            {postIMGURL &&<div className='w-full text-center my-2 rounded-md  relative'>

              <svg onClick={() => setpostIMGURL('')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-3 right-3  cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              <img src={postIMGURL} alt="" className="rounded-xl w-full object-cover h-80" />
            </div>}
            <div className="flex justify-between">

              <input onChange={handleImage} id={`postIMG-${postId}`} type="file" className='hidden' />
              <label onClick={(e) => e.stopPropagation()} className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm  text-slate-600 transition hover:bg-slate-100 w-fit' htmlFor={`postIMG-${postId}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#059669" className="size-6 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="text-slate-400 text-sm ">photo/video</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
              <Button disabled={isLoading} onClick={CPostForm} className='cursor-pointer'>{isLoading ? 'loading..': 'Update'}  </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
    
  )
}
