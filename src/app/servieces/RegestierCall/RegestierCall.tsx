'use server'

import { FailedLogin, SuccesLogin } from "@/types/authInterface"

export async function RegestierCall(values: any) {
  const resp = await fetch(`${process.env.API}/users/signup`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: { 'Content-Type': 'application/json' }
  })

  const payload:SuccesLogin | FailedLogin = await resp.json()

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