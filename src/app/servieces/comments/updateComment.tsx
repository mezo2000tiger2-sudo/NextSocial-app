'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function updateComment({formdata , postId , commentId}:{formdata:FormData , postId:string , commentId:string}){
const cookieStore = await cookies();
  
  const authToken = cookieStore.get('next-auth.session-token')?.value || 
                    cookieStore.get('__Secure-next-auth.session-token')?.value;const token = await decode({
    token:authToken,
    secret:process.env.NEXTAUTH_SECRET!
})


const resp = await fetch (`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,{
    method:'PUT',
    headers: {                                    
    Authorization: `Bearer ${token?.token}`     
  },
  body: formdata 
})
  console.log(resp);
const data = await resp.json()
  return data
}