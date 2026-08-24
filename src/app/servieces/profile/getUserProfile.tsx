'use server'

import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function getUserProfile(userId: string) {
  const cookieStore = await cookies();

  const authToken = cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value;
  const token = await decode({
    token: authToken,
    secret: process.env.NEXTAUTH_SECRET!
  })

  const currentUser = token?.user as { _id?: string } | undefined
  const currentUserId = currentUser?._id

  const resp = await fetch(`https://route-posts.routemisr.com/users/${userId}/profile`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token?.token}`
    }
  })
  const payload = await resp.json()

  const profileUser = payload?.data?.user ?? payload?.data
  const followers = profileUser?.followers ?? []

  const isFollowing = followers.some(
    (follower: string | { _id?: string; id?: string }) =>
      (typeof follower === 'string' ? follower : follower._id ?? follower.id) === currentUserId
  )

  payload.isFollowing = isFollowing
  if (profileUser) {
    profileUser.isFollowing = isFollowing
  }

  return payload
}
