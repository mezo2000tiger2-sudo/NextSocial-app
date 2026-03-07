'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Home, User, Bell, Settings, LogOut, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getCommentCount } from '@/app/servieces/notifications/getCount'
import { Spinner } from '@/components/ui/spinner'
import { getProfile } from '@/app/servieces/profile/getProfile'

export default function Nav() {
  const { data:profile, isPending } = useQuery({
      queryKey: ['profile'],
      queryFn: getProfile,
    })
      const user = profile?.data?.user

    const {status , data} = useSession()
    const pathname = usePathname()
    const {data:navCount , isLoading}=useQuery({
      queryKey:['nav count'],
      queryFn:getCommentCount,
      enabled: status === 'authenticated',
    })
    console.log('navCount',navCount);
    
  return (
       <nav className="w-full bg-white border-b border-gray-200 px-3 md:px-10 py-3 flex items-center justify-between sticky top-0 z-50 overflow-x-hidden">

      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <div className="bg-blue-800 text-white text-xs font-bold px-1 md:px-2.5 py-1.5 rounded">
          <div className='flex'>

          Mus<span className='hidden sm:block'>tafa</span>
          </div>
        </div>
        <span className="font-semibold text-gray-800 text-xl hidden sm:block">Social app</span>
      </div>

      {/* Center: Nav links with gray pill background */}
      <div className="flex items-center md:gap-1 backdrop-blur-2xl bg-gray-100/50 rounded-full p-1">
        <Link
          href="/"
          className={`flex items-center gap-2 px-1 md:px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          }`}
        >
          <Home className="h-6 w-6 shrink-0" />
          <span className="hidden sm:block">Feed</span>
        </Link>

        <Link
          href="/profile"
          className={`flex items-center gap-2 px-1 md:px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/profile"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          }`}
        >
          <User className="h-6 w-6 shrink-0" />
          <span className="hidden sm:block">Profile</span>
        </Link>

        <Link
          href="/notifications"
          className={`flex items-center gap-2 px-1 md:px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/notifications"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          }`}
        >
          <div className="relative">
            <Bell className="h-6 w-6 shrink-0" />
            <Badge className="absolute -top-3 -right-3 min-w-[20px] h-5 px-1 flex items-center justify-center bg-red-500 hover:bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
              {isLoading ?      <Spinner className="size-3" />:(navCount?.success == true ? navCount?.data?.unreadCount : 0)}
            </Badge>
          </div>
          <span className="hidden sm:block">Notifications</span>
        </Link>
      </div>

      {/* Right: User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-gray-100 transition-colors focus:outline-none bg-gray-50 border">
            {isPending ?       <Spinner className="size-3" />:<img
              src={user?.photo}
              alt="mustafa ibrahim"
              className="h-9 w-9 rounded-full object-cover shrink-0"
            />}
            
            <span className="text-sm font-medium text-gray-800 hidden md:block">{user?.name}</span>
            <Menu className="h-5 w-5 text-gray-500 shrink-0" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <Link href={'/profile'}>
            Profile
            </Link>
          </DropdownMenuItem>
            <Link href={'/settings'}>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 text-sm">

            <Settings className="h-4 w-4 text-gray-500" />
            Settings
          </DropdownMenuItem>
            </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 text-sm text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => signOut({ callbackUrl: '/login' })}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </nav>
  )
}
