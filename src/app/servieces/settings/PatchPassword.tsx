'use server'

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";


export async function PatchPassword(values: any) {
    const cookieStore = await cookies();
      
      const authToken = cookieStore.get('next-auth.session-token')?.value || 
                        cookieStore.get('__Secure-next-auth.session-token')?.value;const token = await decode({
        token:authToken,
        secret:process.env.NEXTAUTH_SECRET!
    })
  const resp = await fetch(`https://route-posts.routemisr.com/users/change-password`, {
    method: 'PATCH',
    headers: {                                    
    Authorization: `Bearer ${token?.token}`   ,
    'Content-Type': 'application/json'  
  },
    body: JSON.stringify(values),
  })

  const payload = await resp.json()

  if ('data' in payload) {
    return  {
        message:payload.message,
        success:payload.success
    } 
}else{
    return {message:payload.message,
        success:payload.success
      }
  }

}