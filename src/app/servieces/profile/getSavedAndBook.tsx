'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function getSavedAndBook({ page, userId }: { page: string, userId: string }) {
  const cookieStore = await cookies();

  const authToken = cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value; const token = await decode({
      token: authToken,
      secret: process.env.NEXTAUTH_SECRET!
    })

  let url = ''
  if (page == 'myPosts') {
    url = `https://route-posts.routemisr.com/users/${userId}/posts`
  }
  if (page == 'Saved') {
    url = 'https://route-posts.routemisr.com/users/bookmarks'
  }
  const resp = await fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token?.token}`
    }
  })
  const payload = await resp.json()
  return payload
}