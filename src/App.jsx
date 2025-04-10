"use client"

import { useState, useEffect } from "react"
import Directory from "./components/Directory"
import Slideshow from "./components/Slideshow"
import InfoPanel from "./components/InfoPanel"
import Header from "./components/Header"
import { bureauData } from "./data/bureauData"
import "./App.css"

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSplash, setShowSplash] = useState(true)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Hide splash screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center animate-fadeIn">
          <div className="w-40 h-40 mx-auto mb-6">
            <img src="/logo.png" alt="Federal Prison Commission Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-blue-800 mb-2">BureauSync TV Display</h1>
          <p className="text-xl text-blue-600">Federal Prison Commission</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <Header currentTime={currentTime} />
      <div className="flex flex-1 overflow-hidden">
        {/* Main content - Slideshow (larger) */}
        <div className="flex-1 p-6 overflow-hidden">
          <Slideshow bureaus={bureauData} />
        </div>

        {/* Sidebar - Directory and Info Panel (smaller) */}
        <div className="w-80 flex flex-col border-l border-blue-100 bg-white shadow-lg">
          <div className="flex-1 overflow-y-auto">
            <Directory bureaus={bureauData} />
          </div>
          <div className="border-t border-blue-100">
            <InfoPanel currentTime={currentTime} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
