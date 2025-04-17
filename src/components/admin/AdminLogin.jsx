"use client"

import { useState } from "react"
import { Lock, User } from "lucide-react"

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simple authentication - in a real app, this would be more secure
    if (username === "admin" && password === "admin123") {
      onLogin(true)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">BureauSync Admin</h2>
            <p className="text-blue-100">Sign in to manage promotions</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>

            <div className="text-sm text-center text-gray-500">
              <p>Default credentials: admin / admin123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
