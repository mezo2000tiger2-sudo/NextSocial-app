'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getNotifications } from '../servieces/notifications/getNotofications'
import { Notification } from "@/types/notoficationsInterface"
import NotificationsList from "../_components/NotificationItem/NotificationItem";

export default function Notifications() {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })
  

  const notifications: Notification[] = data?.data?.notifications ?? []
  const unreadCount = notifications.filter(n => !n.isRead).length

  // if (isLoading) return <div>Loading...</div>
  if (isLoading) return <>
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-3xl mx-auto">

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Realtime updates for likes, comments, shares, and follows.
          </p>
        </div>
        <button
        disabled
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          mark All as unread
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-4">
        <button
        disabled
          className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors bg-blue-500 text-white`}
        >
          All
        </button>
        <button
        disabled
          className={`text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-colors  bg-gray-200 text-black`}
        >
          Unread
        </button>
      </div>

      <div className="flex flex-col gap-3">
        loading...
      </div>

    </div>
  </>

  return (
    <div>
      <NotificationsList
        notifications={notifications}
        unreadCount={unreadCount}
      />
    </div>
  )
}