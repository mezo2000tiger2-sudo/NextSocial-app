'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getProfile } from '../servieces/profile/getProfile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Users, Plus, ThumbsUp, Repeat2, MessageCircle, Clock } from 'lucide-react'
import { updateProfilePicture } from '../servieces/profile/uploadProfilePicture'
import { getSavedAndBook } from '../servieces/profile/getSavedAndBook'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

function PostCard({ post }: { post: any }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.user?.photo}
            alt={post.user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-bold text-gray-900">{post.user?.name}</p>
            <p className="text-xs text-gray-400">@{post.user?.username}</p>
          </div>
        </div>
        <Link
          href={`/singlepost/${post._id}`} 
         className="text-sm font-semibold text-blue-500 hover:underline"
        >
          View details
        </Link>
      </div>

      {post.body && <p className="text-sm text-gray-700">{post.body}</p>}

      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full max-h-72 object-cover rounded-xl"
        />
      )}

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {post.likesCount} likes
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 className="w-4 h-4" />
            {post.sharesCount} shares
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.commentsCount} comments
          </span>
        </div>
        <span className="items-center gap-1 text-xs hidden md:flex text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          {formattedDate}
        </span>
      </div>
    </div>
  )
}

export default function Profile() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState('myPosts')

  const { data, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { mutate: uploadImg } = useMutation({
    mutationKey: ['upload profile picture'],
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const user = data?.data?.user

  const { data: savedBookedData, isPending: savedBookedLoading } = useQuery({
    queryKey: ['profile saved Booked Data', page, user?._id],
    queryFn: () => getSavedAndBook({ page, userId: user!._id }),
    enabled: !!user?._id,
  })

  const count =
    page === 'myPosts'
      ? savedBookedData?.data?.posts?.length ?? 0
      : savedBookedData?.data?.bookmarks?.length ?? 0

  const posts =
    page === 'myPosts'
      ? savedBookedData?.data?.posts
      : savedBookedData?.data?.bookmarks

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">

      {/* ── Profile card ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-5 bg-white mt-5 rounded-2xl">

        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Avatar + identity */}
          <div className="flex items-center gap-5 flex-1">
            <div className="relative shrink-0">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="profileimg"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const formData = new FormData()
                  formData.append('photo', file)
                  uploadImg(formData)
                }}
              />
              <label
                htmlFor="profileimg"
                className="absolute bottom-1 right-1 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-2 border-white transition-transform hover:scale-110 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
              </label>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {user?.name ?? '—'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">@{user?.username ?? '—'}</p>
              <Badge
                variant="outline"
                className="mt-3 text-blue-600 border-blue-200 bg-blue-50 gap-1.5 px-3 py-1 text-xs font-semibold"
              >
                <Users className="w-3 h-3" />
                Route Posts Member
              </Badge>
            </div>
          </div>

          {/* Stat cards */}
          <div className="flex gap-3 shrink-0">
            {[
              { label: 'Followers', value: user?.followersCount ?? 0 },
              { label: 'Following', value: user?.followingCount ?? 0 },
              { label: 'Bookmarks', value: user?.bookmarksCount ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm w-24 sm:w-32 py-4 px-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 leading-tight">
                  {label}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* About */}
          <div className="flex-1 bg-gray-50 rounded-2xl shadow-sm px-5 pt-4 pb-5 space-y-3">
            <p className="text-sm font-bold text-gray-900">About</p>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{user?.email ?? '—'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Active on Route Posts</span>
            </div>
          </div>

          {/* My Posts + Saved counts */}
          <div className="flex flex-col gap-3 w-full lg:w-60">
            <div className="bg-white rounded-2xl shadow-sm px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
                My Posts
              </p>
              <p className="text-2xl font-extrabold text-gray-900">
                {page === 'myPosts' ? count : '—'}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
                Saved Posts
              </p>
              <p className="text-2xl font-extrabold text-gray-900">
                {user?.bookmarksCount ?? 0}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="max-w-6xl mx-auto mt-5 rounded-2xl">
        <div className="rounded-2xl flex justify-between items-center gap-2 bg-white p-3 shadow-sm">
          <div className="flex gap-2 justify-center items-center bg-gray-200 p-1 rounded-xl">

            <button
              onClick={() => setPage('myPosts')}
              className={
                page === 'myPosts'
                  ? 'flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition bg-white text-[#1877f2] whitespace-nowrap'
                  : 'whitespace-nowrap mt-1 flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
              </svg>
              My Posts
            </button>

            <button
              onClick={() => setPage('Saved')}
              className={
                page === 'Saved'
                  ? 'flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition bg-white text-[#1877f2]'
                  : 'mt-1 flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Saved
            </button>

          </div>

          <p className="p-1 bg-blue-100 text-blue-600 rounded-2xl px-3 font-bold text-xs">
            {savedBookedLoading ? <Spinner className="size-4" /> : count}
          </p>
        </div>
      </div>

      {/* ── Posts list ── */}
      <div className="max-w-6xl mx-auto mt-4 pb-10 space-y-3">
        {savedBookedLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-6" />
          </div>
        ) : posts?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm px-5 py-10 text-center text-gray-400 text-sm">
            No posts found.
          </div>
        ) : (
          posts?.map((post: any) => <PostCard key={post._id} post={post} />)
        )}
      </div>

    </div>
  )
}