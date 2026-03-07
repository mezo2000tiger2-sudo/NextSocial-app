'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function getSinglePost(pageId: string) {
  const cookieStore = await cookies();

  const authToken = cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value; const token = await decode({
      token: authToken,
      secret: process.env.NEXTAUTH_SECRET!
    })
  const resp = await fetch(`https://route-posts.routemisr.com/posts/${pageId}`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token?.token}`
    }
  })
  const payload = await resp.json()
  return payload
}