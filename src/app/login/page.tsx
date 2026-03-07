'use client'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from "zod"
import { useRouter } from 'next/navigation';
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Loginschema } from '@/_Schema/LoginSchema';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

type inputes = {
  email: '',
  password: '',

}



export default function Login() {
  const [isLoading, setisLoading] = useState(false)
  const [chekPassword, setchekPassword] = useState('password')
  const [chekRePassword, setchekRePassword] = useState('password')
  const [error, seterror] = useState('')
  const router = useRouter()

  const form = useForm(
    {
      defaultValues: {
        email: '',
        password: '',
      },
      resolver: zodResolver(Loginschema),
      mode: 'onSubmit',
      reValidateMode: 'onBlur'

    }
  )
  async function submitForm(values: zod.infer<typeof Loginschema>) {
    setisLoading(true)
    const resp = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    })

    if (resp?.ok) {
router.push('/')
  router.refresh() 
    } else {
      seterror('invalid email or password')
    }
    console.log(resp);


    console.log(values)
    setisLoading(false)

  }

  return <>
    <div className="min-h-screen py-7 flex justify-center items-center bg-gray-300 absolute top-0 right-0 bottom-0 left-0 z-50">

      <div className="w-5/6  md:w-1/2 mx-auto p-5 bg-gray-100 rounded-lg overflow-hidden">
        <h2 className='text-blue-700 font-bold text-3xl mb-2'>Login now:</h2>
        <form onSubmit={form.handleSubmit(submitForm)}>


          <div className="mt-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email:</FieldLabel>
                  <Input
                    className='bg-gray-200'
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="EX:Name123@gmail.com"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <div className="mt-4">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>password:</FieldLabel>
                  <div className="relative">
                    <Input
                      className='bg-gray-200'
                      type={chekPassword}
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="EX:xX@123"
                    />
                    {chekPassword == 'password' ?
                      <svg onClick={() => { setchekPassword('text') }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>

                      :
                      <svg
                        onClick={() => { setchekPassword('password') }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
                      >
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

          <h2 className='text-red-500  mt-2 text-lg text-center'>{error}</h2>
          <Button type='submit' className='my-6 w-full bg-blue-900 hover:bg-blue-950'>{isLoading ?
            <>

              <LoaderIcon
                role="status"
                aria-label="Loading"
                className={cn("size-4 animate-spin",)}

              />
              Loading....
            </> : <>submit</>
          }</Button>
          <p className='text-blue-600 text-center'>don't have an account? <Link href={'/regestier'} className='text-blue-700 hover:underline'>Regestier</Link></p>


        </form>
      </div>
    </div>
  </>
}
