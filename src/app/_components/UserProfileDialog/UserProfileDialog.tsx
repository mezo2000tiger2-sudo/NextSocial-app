'use client'
import { followUser } from "@/app/servieces/HomePage/followUser";
import { getUserProfile } from "@/app/servieces/profile/getUserProfile";
import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Users } from "lucide-react";

interface UserProfile {
  _id?: string
  name?: string
  username?: string
  email?: string
  photo?: string
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
  isFollowing?: boolean
}

interface UserProfileDialogProps {
  userId: string | null
  currentUserId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserProfileDialog({ userId, currentUserId, open, onOpenChange }: UserProfileDialogProps) {
  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: ['user profile', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: open && !!userId,
  })

  const payload = data as { data?: ({ user?: UserProfile } & UserProfile) } | undefined
  const user = payload?.data?.user ?? payload?.data

  const following = !!user?.isFollowing

  const { mutate: toggleFollow, isPending: isFollowPending } = useMutation({
    mutationKey: ['follow user', userId],
    mutationFn: () => followUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user profile', userId] })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex items-center justify-center py-10">
            <Spinner className="size-8" />
          </div>
        ) : (
          <div className="space-y-5">

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg shrink-0 mx-auto sm:mx-0">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight truncate">
                  {user?.name ?? '—'}
                </h1>
                <p className="text-sm text-gray-400 mt-1">@{user?.username ?? '—'}</p>
                <Badge
                  variant="outline"
                  className="mt-2 text-blue-600 border-blue-200 bg-blue-50 gap-1.5 px-3 py-1 text-xs font-semibold"
                >
                  <Users className="w-3 h-3" />
                  Route Posts Member
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { label: 'Followers', value: user?.followersCount ?? 0 },
                { label: 'Following', value: user?.followingCount ?? 0 },
                { label: 'Bookmarks', value: user?.bookmarksCount ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm flex-1 py-4 px-2 text-center border border-slate-100">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 leading-tight">
                    {label}
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl shadow-sm px-5 pt-4 pb-5 space-y-3">
              <p className="text-sm font-bold text-gray-900">About</p>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="break-all">{user?.email ?? '—'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Active on Route Posts</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              {userId !== currentUserId && (
                <Button
                  disabled={isFollowPending}
                  variant={following ? 'outline' : 'default'}
                  onClick={() => toggleFollow()}
                >
                  {isFollowPending ? <Spinner className="size-4" /> : following ? 'Following' : 'Follow'}
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>

          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
