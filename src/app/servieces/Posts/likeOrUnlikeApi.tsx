'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function likeOrUnlickApi(postId: string) {
  const cookieStore = await cookies();

  const authToken = cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value;
  const token = await decode({
    token: authToken,
    secret: process.env.NEXTAUTH_SECRET!
  })


  const resp = await fetch(`https://route-posts.routemisr.com/posts/${postId}/like`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token?.token}`
    }
  })
  console.log(resp);
  if (!resp.ok) {
    throw new Error('Failed to like/unlike post: ' + resp.statusText);
  }
  const data = await resp.json()
  return data
}