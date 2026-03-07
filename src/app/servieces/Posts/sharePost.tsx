'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function SharePost({body , postId}:{body:string , postId:string}){
      console.log('Sending body:',  body.length );  
const cookieStore = await cookies();
  
  const authToken = cookieStore.get('next-auth.session-token')?.value || 
                    cookieStore.get('__Secure-next-auth.session-token')?.value;const token = await decode({
    token:authToken,
    secret:process.env.NEXTAUTH_SECRET!
})

if(body.length == 0){
  
  const resp = await fetch (`https://route-posts.routemisr.com/posts/${postId}/share`,{
      method:'POST',
      headers: {                                    
      Authorization: `Bearer ${token?.token}`  ,   
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      
      body : ' '
    })
    
  })
    console.log(resp);
  const data = await resp.json()
    return data
}else{

  const resp = await fetch (`https://route-posts.routemisr.com/posts/${postId}/share`,{
      method:'POST',
      headers: {                                    
      Authorization: `Bearer ${token?.token}`  ,   
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      
      body 
    })
    
  })
    console.log(resp);
  const data = await resp.json()
    return data
}
}