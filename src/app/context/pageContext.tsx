// context/PostContext.tsx
'use client'
import { createContext, useContext, useState } from 'react'

// 1. Create context
const PageContext = createContext<any>(null)

// 2. Create provider
export function PostProvider({ children }: { children: React.ReactNode }) {
  const [Page, setpage] = useState('')

  return (
    <PageContext.Provider value={{ Page, setpage }}>
      {children}
    </PageContext.Provider>
  )
}

// 3. Create custom hook
export function usePost() {
  return useContext(PageContext)
}