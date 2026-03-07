'use client'
import { markAllRead } from "@/app/servieces/notifications/markAllRead";
import { markNotoficationRead } from "@/app/servieces/notifications/markNotificationRead";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export interface NotificationUser {
  _id: string;
  name: string;
  photo: string;
  username?: string;
}

export interface NotificationEntity {
  _id: string;
  body: string;
  user: string;
  commentsCount: number;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export interface Notification {
  _id: string;
  recipient: NotificationUser;
  actor: NotificationUser;
  type: "comment_post" | "like_post" | "share_post";
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: NotificationEntity;
}

function CommentIcon() {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
      </svg>
    </div>
  );
}

function LikeIcon() {
  return (
    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
    </div>
  );
}

function ShareIcon() {
  return (
    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
      </svg>
    </div>
  );
}

function getNotificationText(type: Notification["type"]) {
  switch (type) {
    case "comment_post": return "commented on your post";
    case "like_post":    return "liked your post";
    case "share_post":   return "shared your post";
    default:             return "interacted with your post";
  }
}

function getTypeIcon(type: Notification["type"]) {
  switch (type) {
    case "comment_post": return <CommentIcon />;
    case "like_post":    return <LikeIcon />;
    case "share_post":   return <ShareIcon />;
    default:             return <CommentIcon />;
  }
}

function formatShortTime(createdAt: string) {
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: false })
      .replace("about ", "")
      .replace(" days", "d").replace(" day", "d")
      .replace(" hours", "h").replace(" hour", "h")
      .replace(" minutes", "m").replace(" minute", "m")
      .replace(" seconds", "s").replace(" second", "s")
      .replace(" ago", "")
      .replace("less than a minute", "now");
  } catch {
    return "";
  }
}

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const { _id, actor, type, entity, isRead, createdAt } = notification;
  const querClient = useQueryClient()

  const postPreview =
    entity?.body && entity.body !== "updated profile picture."
      ? entity.body
      : "";

  const { mutate: markAsRead, isPending } = useMutation({
    mutationKey: ['mark notification as read', _id],
    mutationFn: () => markNotoficationRead(_id),
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  return (
    <Link href={`/singlepost/${entity?._id}`} className="block">
      <div className={`flex items-start gap-3 px-4 py-4 rounded-xl border transition-colors hover:brightness-95 cursor-pointer ${
        !isRead ? "bg-blue-50 border-blue-100" : "bg-white border-gray-100"
      }`}>

        <div className="relative flex-shrink-0">
          <img
            src={actor.photo}
            alt={actor.name}
            className="w-11 h-11 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-profile.png'
            }}
          />
          <div className="absolute -bottom-1 -right-1">
            {getTypeIcon(type)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-snug">
            <span className="font-bold">{actor.name}</span>{" "}
            <span className="text-slate-600">{getNotificationText(type)}</span>
          </p>
          {postPreview && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{postPreview}</p>
          )}

          <div className="mt-2">
            {isRead ? (
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Read
              </span>
            ) : (
              <button
                disabled={isPending}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  markAsRead()
                }}
                className="flex items-center gap-1.5 text-xs text-blue-600 font-medium border border-blue-200 rounded-full px-2.5 py-1 w-fit hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {isPending ? "Marking..." : "Mark as read"}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          <span className="text-xs text-slate-400">{formatShortTime(createdAt)}</span>
          {!isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
        </div>

      </div>
    </Link>
  );
}

interface NotificationsListProps {
  notifications: Notification[];
  unreadCount?: number;
}

export default function NotificationsList({
  notifications,
  unreadCount = 0,
}: NotificationsListProps) {
  // ✅ Filter state
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const querClient = useQueryClient()
  const { mutate: markAllAsRead, isPending: allPending } = useMutation({
    mutationKey: ['mark all notifications as read'],
    mutationFn: markAllRead,
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-3xl mx-auto">

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Realtime updates for likes, comments, shares, and follows.
          </p>
        </div>
        <button
          disabled={allPending}
          onClick={() => markAllAsRead()}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          {allPending ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-4">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-slate-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
            filter === "unread"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-slate-600 hover:bg-gray-200"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full border ${
              filter === "unread"
                ? "bg-white text-blue-600 border-blue-200"
                : "bg-white text-slate-700 border-gray-200"
            }`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <p className="text-sm">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>

    </div>
  );
}