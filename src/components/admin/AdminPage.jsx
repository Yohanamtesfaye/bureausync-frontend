"use client"

import { useState } from "react"
import AdminLogin from "./AdminLogin"
import PromotionAdmin from "./PromotionAdmin"

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        <PromotionAdmin onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <AdminLogin onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  )
}

export default AdminPage
