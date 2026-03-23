
import React from "react"
import { Navigate } from "react-router-dom"
import { checkAdminSession } from "@/lib/auth"

export function AdminRoute({ children }) {
  const isAuthenticated = checkAdminSession()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
