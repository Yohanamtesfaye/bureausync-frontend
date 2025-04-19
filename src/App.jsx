"use client"

import { useState, useEffect } from "react"
import Directory from "./components/Directory"
import Slideshow from "./components/Slideshow"
import InfoPanel from "./components/InfoPanel"
import Header from "./components/Header"
import AdminPage from "./components/admin/AdminPage"
import PromotionPanel from "./components/PromotionPanel"
import { bureauData } from "./data/bureauData"
import "./App.css"

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSplash, setShowSplash] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Check if we're in admin mode based on URL
  useEffect(() => {
    const path = window.location.pathname
    if (path === "/admin") {
      setIsAdminMode(true)
      setShowSplash(false) // Skip splash screen in admin mode
    }
  }, [])

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

  // Get unique floors and split them for left and right sides
  const getFloors = () => {
    const floors = [...new Set(bureauData.map((bureau) => bureau.floor))].sort((a, b) => a - b)
    const midpoint = Math.ceil(floors.length / 2)

    return {
      leftFloors: floors.slice(0, midpoint),
      rightFloors: floors.slice(midpoint),
    }
  }

  const { leftFloors, rightFloors } = getFloors()

  // If in admin mode, show the admin interface
  if (isAdminMode) {
    return <AdminPage />
  }

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
        {/* Left side - Directory with first half of floors */}
        <div className="w-1/4 border-r border-blue-100 bg-white shadow-lg overflow-y-auto">
          <Directory bureaus={bureauData} showOnlyFloors={leftFloors} />
        </div>

        {/* Center - Main content - Split between Slideshow and Promotion Panel */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {/* Main content area split into two sections */}
          <div className="flex flex-1 gap-4 overflow-hidden">
            {/* Slideshow section */}
            <div className="w-3/5 bg-white rounded-lg shadow-sm p-4 overflow-hidden">
              <Slideshow bureaus={bureauData} />
            </div>

            {/* Promotion section - always visible */}
            <div className="w-2/5 overflow-hidden">
              <PromotionPanel />
            </div>
          </div>
        </div>

        {/* Right side - Directory with second half of floors and Info Panel */}
        <div className="w-1/4 flex flex-col border-l border-blue-100 bg-white shadow-lg">
          <div className="flex-1 overflow-y-auto">
            <Directory bureaus={bureauData} showOnlyFloors={rightFloors} alternateStyle={true} />
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
