'use client'
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 1}>
      {children}
    </SessionProvider>
  )
}