'use client'


import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Regestierschema } from '@/schema/regestierSchema';
import * as zod from "zod"
import { useRouter } from 'next/navigation';
import { LoaderIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';
import { RegestierCall } from '../servieces/RegestierCall/RegestierCall';
import { ChangePasswordSchema } from '@/_Schema/ChangePasswordSchema';
import { PatchPassword } from '../servieces/settings/PatchPassword';
import { signOut } from 'next-auth/react';




type inputes = {
  password: '',
  newPassword: ''
}



export default function settinges() {
  const [isLoading, setisLoading] = useState(false)
  const [chekPassword, setchekPassword] = useState('password')
  const [chekRePassword, setchekRePassword] = useState('password')
  const [error, seterror] = useState('')
  const router = useRouter()

  const form = useForm(
    {
      defaultValues: {
        password: '',
        newPassword: ''
      },
      resolver: zodResolver(ChangePasswordSchema),
      mode: 'onSubmit',
      reValidateMode: 'onBlur'

    }
  )
  async function submitForm(values: zod.infer<typeof ChangePasswordSchema>) {
    setisLoading(true)
    const resp = await PatchPassword(values)
    if (resp.success == true) {
      window.location.href = '/login'
      signOut({ callbackUrl: '/login' })
      console.log('settings', resp);

    } else {
      console.log('settings', resp);
      seterror(resp.message)
    }
    setisLoading(false)
  }

  return <>
    <div className="min-h-screen flex justify-center items-center bg-gray-100 overflow-y-auto">
      <div className="flex justify-center py-7 w-full min-h-full">

        <div className="w-5/6 mt-36 md:w-1/2 mx-auto p-8 bg-white rounded-2xl shadow-md overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3b82f6" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-2xl leading-tight">Change Password</h2>
              <p className="text-gray-400 text-sm">Keep your account secure by using a strong password.</p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(submitForm)}>

            {/* Current Password */}
            <div className="mt-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-1">Current password</FieldLabel>
                    <div className="relative">
                      <Input
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        type={chekPassword}
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter current password"
                      />
                      {chekPassword === 'password' ?
                        <svg onClick={() => { setchekPassword('text') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        :
                        <svg onClick={() => { setchekPassword('password') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      }
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* New Password */}
            <div className="mt-4">
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-1">New password</FieldLabel>
                    <div className="relative">
                      <Input
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        type={chekRePassword}
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter new password"
                      />
                      {chekRePassword === 'password' ?
                        <svg onClick={() => { setchekRePassword('text') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        :
                        <svg onClick={() => { setchekRePassword('password') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      }
                    </div>
                    <p className="text-gray-400 text-xs mt-1">At least 8 characters with uppercase, lowercase, number, and special character.</p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <h2 className="text-red-500 mt-4 text-sm text-center">{error}</h2>

            <Button type="submit" className="mt-6 w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-xl transition-colors">
              {isLoading ? (
                <>
                  <LoaderIcon
                    role="status"
                    aria-label="Loading"
                    className={cn("size-4 animate-spin mr-2")}
                  />
                  Loading....
                </>
              ) : (
                <>Update password</>
              )}
            </Button>

          </form>
        </div>

      </div>
    </div>
  </>
}
