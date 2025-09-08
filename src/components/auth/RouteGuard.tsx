// components/auth/RouteGuard.tsx
"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useProfileQuery } from "@/api/queries/profile"
import { useAuth } from "@/contexts/AuthContext"

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useProfileQuery()
  const { checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Auth holatini yangilash
  useEffect(() => {
    if (!isLoading) {
      checkAuth()
    }
  }, [user, isLoading, checkAuth])

  useEffect(() => {
    // Agar loading bo'lmasa va user ma'lumotlari mavjud bo'lsa
    if (!isLoading && user) {
      // Agar userda interests bo'lmasa va hozir interest sahifada bo'lmasa
      if ((!user.interests || user.interests.length === 0) && pathname !== "/interests") {
        router.push("/interests")
      }
      
      // Agar userda interest bor bo'lsa va interest sahifada bo'lsa
      if (user.interests && user.interests.length > 0 && pathname === "/interests") {
        router.push("/")
      }
    }

    // Agar error bo'lsa (masalan, 401)
    if (error) {
      console.error("Profile fetch error:", error)
    }
  }, [user, isLoading, pathname, router, error])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}