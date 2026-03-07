'use client'


import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {Controller, useForm} from 'react-hook-form'
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
import { Regestierschema } from '@/_Schema/RegestierSchema';
// import toast from 'react-hot-toast';
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




type inputes={
  name: '',
  username: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  password: '',
  rePassword: ''
}



export default function Regestier() {
  const [isLoading, setisLoading] = useState(false)
    const [chekPassword, setchekPassword] = useState('password')
    const [chekRePassword, setchekRePassword] = useState('password')
  const [error, seterror] = useState('')
  const router = useRouter()

  const form = useForm(
    {
      defaultValues:{       
        name: '',
        username: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        rePassword: ''
      },
      resolver:zodResolver(Regestierschema),
      mode:'onSubmit',
      reValidateMode:'onBlur'

    }
  )
  async function submitForm(values:zod.infer<typeof Regestierschema>){
    setisLoading(true)
     const formattedValues = {
  ...values,
  dateOfBirth: (() => {
    const date = new Date(values.dateOfBirth)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date.toISOString().split('T')[0]
  })()
}
console.log(formattedValues) 
  const resp =await RegestierCall(formattedValues)
  if(resp.success == true){
    router.push('/login')
  }else{
    seterror(resp.message)
  }
    setisLoading(false)
  }

  return <>
<div className="min-h-screen py-7 flex justify-center items-center bg-gray-300 fixed top-0 right-0 bottom-0 left-0 z-50 overflow-y-auto">
    <div className="flex justify-center py-7 w-full min-h-full">

  <div className="w-5/6 mt-36 md:w-1/2 mx-auto p-5 bg-gray-100 rounded-lg overflow-hidden">
    <h2 className='text-blue-700 font-bold text-3xl mb-2'>Register now:</h2>
  <form onSubmit={form.handleSubmit(submitForm)}>
    <div className="mt-4">
      <Controller
  name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Name:</FieldLabel>
      <Input
      className='bg-gray-200'
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="EX:Mustafa"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
    </div>
    <div className="mt-4">
      <Controller
  name="username"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>username:</FieldLabel>
      <Input
      className='bg-gray-200'
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="EX:mezo200"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
    </div>
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
    {/* <div className="mt-4">
      <Controller
  name="dateOfBirth"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>date of birth:</FieldLabel>
      <Input
      className='bg-gray-200'
        {...field}
        id={field.name}
        type='date'
        aria-invalid={fieldState.invalid}
        placeholder="EX:Name123@gmail.com"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
    </div> */}
    <div className="mt-4">
  <Controller
    name="dateOfBirth"
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel>Date of Birth:</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-gray-200"
            >
              <CalendarIcon className="mr-2 size-4" />
              {field.value 
          ? (() => {
      const date = new Date(field.value as Date)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return date.toISOString().split('T')[0]
    })()
  : "Pick a date"
}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={field.value as Date | undefined}
              onSelect={field.onChange}
              disabled={(date) => date > new Date()}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
</div>
    
    <div className="mt-4">
      <Controller
  name="gender"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>gender:</FieldLabel>
      <Select
       name={field.name}
       
    value={field.value}
    onValueChange={field.onChange}
>
  <SelectTrigger 
    id={field.name}
    ref={field.ref}     
    onBlur={field.onBlur}  
    className="w-full bg-gray-200"
  >
    <SelectValue placeholder="Select gender" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Gender</SelectLabel>
      <SelectItem value="male">Male</SelectItem>
      <SelectItem value="female">Female</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
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
              {chekPassword == 'password'? 
              <svg onClick={()=>{setchekPassword('text')}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
      
              :
              <svg 
              onClick={()=>{setchekPassword('password')}}
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
    <div className="mt-4">
      <Controller
  name="rePassword"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Re-Password:</FieldLabel>
      <div className="relative">
              <Input
                className='bg-gray-200'
                type={chekRePassword}
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="EX:xX@123"
              />
              {chekRePassword == 'password'? 
              <svg onClick={()=>{setchekRePassword('text')}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
      
              :
              <svg 
              onClick={()=>{setchekRePassword('password')}}
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

    <h2 className='text-red-500  mt-4 text-xl text-center'>{error}</h2>
    <Button type='submit' className='my-6 w-full bg-blue-900 hover:bg-blue-950'>{isLoading? 
    <>
    
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin",)}

    />
    Loading....
    </>:<>submit</>
    }</Button>
    <p className='text-blue-600 text-center'>you have an account? <Link href={'login'} className='text-blue-700 hover:underline'>login</Link></p>
    
    
  </form>
  </div>
    </div>

  </div>
  </>
}
