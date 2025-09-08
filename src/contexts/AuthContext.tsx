// contexts/AuthContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Tokenni tekshirish funktsiyasi
  const checkAuth = () => {
    const token = Cookies.get('token')
    const loggedIn = !!token
    setIsLoggedIn(loggedIn)
    return loggedIn
  }

  // Komponent yuklanganda tokenni tekshirish
  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}