'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function updatePost({formdata , postId}:{formdata:FormData , postId:string}){
const cookieStore = await cookies();
  
  const authToken = cookieStore.get('next-auth.session-token')?.value || 
                    cookieStore.get('__Secure-next-auth.session-token')?.value;const token = await decode({
    token:authToken,
    secret:process.env.NEXTAUTH_SECRET!
})


const resp = await fetch (`https://route-posts.routemisr.com/posts/${postId}`,{
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