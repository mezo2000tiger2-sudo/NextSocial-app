import { usePost } from '@/app/context/pageContext'
import { addComment } from '@/app/servieces/comments/createComment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Post, PostInterface } from '@/types/postInterface'
import { useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Send } from 'lucide-react'
import React, { useState } from 'react'

export default function PostComment({iscomment , user , post , postId} :{iscomment:boolean , user:any , post:Post , postId:string}) {
    const [postContent, setpostContent] = useState('')
    const { Page, setpage } = usePost()
    const [postIMG, setpostIMG] = useState<File | null>(null)
    const [postIMGURL, setpostIMGURL] = useState<string | null>(null)
    const [isLoading, setisLoading] = useState(false)
    console.log('page', Page);
    
  const quaryclient = useQueryClient()
    async function CPostForm(){
        setisLoading(true)
        console.log('submit' , postContent);
        const formdata = new FormData()
        if(postContent.length > 0){

            formdata.append('content', postContent)

        }else{
            formdata.append('content', '')
        }


        if(postIMG){
            formdata.append('image' , postIMG)
        }
        const resp = await addComment({ formData: formdata, postId: post._id })
        console.log('create',resp);
        if(resp?.success == true){
            setpostContent('')
            setpostIMG(null)
            setpostIMGURL(null)
            
            quaryclient.invalidateQueries({
              queryKey:['single post comments', postId],
               refetchType: 'all'
            })
            quaryclient.invalidateQueries({
              queryKey:['single post', postId],
               refetchType: 'all'
            })
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
    <div className={`${iscomment ? 'flex' : 'hidden'} items-start gap-3 p-3 `}>
  {/* Avatar */}
  <img src={user?.user.photo} alt="" className='h-9 w-9 shrink-0 mt-0.5 rounded-full' />

  {/* Input container */}
  <div className="flex-1 rounded-2xl bg-white p-2 px-2 ">
    <Textarea
  value={postContent}
  onChange={(e) => { setpostContent(e.target.value) }}
  placeholder={`comment as ${user?.user.name}`}
  rows={1}
  className="resize-none border-none shadow-none focus-visible:ring-0 px-4 pt-3 pb-1 text-sm bg-white placeholder:text-gray-400 leading-relaxed w-full overflow-hidden break-all"
/>
{postIMGURL && <img src={postIMGURL} alt="" className="rounded-xl w-full object-cover" />}
    {/* Toolbar */}
    <div className="flex items-center justify-between px-3 pb-2 pt-1">
      <div className="flex items-center gap-1">
         <input onChange={handleImage} id={`ComentIMG ${post._id}`} type="file" className='hidden' />
         <label className='h-7 w-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 flex justify-center items-center' htmlFor={`ComentIMG ${post._id}` }>

          <ImageIcon className="h-5 w-5" />
         </label>
        
      </div>
      <Button disabled={isLoading} onClick={CPostForm} size="icon" className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center">
        <Send className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
</div>
    </>
  )
}
