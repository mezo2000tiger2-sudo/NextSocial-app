import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkelatonPost() {
  return (
    <div>
       
       <div className="flex items-center gap-4 p-3 py-5 rounded-lg bg-white border  w-full mt-3">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
    </div>
  )
}
