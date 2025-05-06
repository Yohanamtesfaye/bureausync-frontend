"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Directory from "./components/Directory"
import Slideshow from "./components/Slideshow"
import Header from "./components/Header"
import AdminLogin from "./components/admin/AdminLogin"
import PromotionAdmin from "./components/admin/PromotionAdmin"
import PromotionPanel from "./components/PromotionPanel"
import { bureauData } from "./data/bureauData"
import "./App.css"

const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [activeDirectoryTab, setActiveDirectoryTab] = useState(0)
  const [slideDirection, setSlideDirection] = useState("right")
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Hide splash screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-cycle directory tabs every 20 seconds
  useEffect(() => {
    if (showSplash) return // Don't cycle during splash screen

    const cycleTimer = setInterval(() => {
      setSlideDirection(activeDirectoryTab === 0 ? "right" : "left")
      setActiveDirectoryTab((prev) => (prev === 0 ? 1 : 0))
    }, 20000) // Change every 20 seconds

    return () => clearInterval(cycleTimer)
  }, [activeDirectoryTab, showSplash])

  // Get unique floors and split them for tabs
  const getFloors = () => {
    const floors = [...new Set(bureauData.map((bureau) => bureau.floor))].sort((a, b) => a - b)
    const midpoint = Math.ceil(floors.length / 2)

    return {
      lowerFloors: floors.slice(0, midpoint),
      upperFloors: floors.slice(midpoint),
    }
  }

  const { lowerFloors, upperFloors } = getFloors()

  // Handle tab change with slide direction
  const handleTabChange = (tabIndex) => {
    if (tabIndex !== activeDirectoryTab) {
      setSlideDirection(tabIndex > activeDirectoryTab ? "right" : "left")
      setActiveDirectoryTab(tabIndex)
    }
  }

  // Main layout for non-admin routes
  const MainLayout = () => (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Directory with tabs for lower and upper floors */}
        <div
          className={`${
            isMobile ? "w-full" : "w-1/3 xl:w-1/4"
          } border-r-2 border-blue-200 bg-white shadow-lg overflow-hidden flex flex-col`}
        >
          <div className="flex border-b-2 border-blue-200">
            <button
              className={`flex-1 py-2 text-sm font-bold ${
                activeDirectoryTab === 0 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
              onClick={() => handleTabChange(0)}
            >
              ታችኛ ፎቆች
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold ${
                activeDirectoryTab === 1 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
              onClick={() => handleTabChange(1)}
            >
              ላይኛ ፎቆች
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {/* Auto-cycling indicator */}
            <div className="absolute top-2 right-2 z-20">
              <div className="w-2 h-2 rounded-full bg-blue-600 opacity-75 animate-pulse"></div>
            </div>

            <div
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                activeDirectoryTab === 0 ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Directory bureaus={bureauData} showOnlyFloors={lowerFloors} />
            </div>
            <div
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                activeDirectoryTab === 1 ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <Directory bureaus={bureauData} showOnlyFloors={upperFloors} alternateStyle={true} />
            </div>
          </div>
        </div>

        {/* Right side - Main content with Slideshow and Promotion Panel */}
        <div className={`${isMobile ? "hidden" : "flex-1"} p-2 md:p-4 overflow-hidden flex flex-col`}>
          {/* Main content area split into two sections */}
          <div className="flex flex-col lg:flex-row flex-1 gap-2 md:gap-4 overflow-hidden">
            {/* Slideshow section - slightly smaller */}
            <div className="lg:w-2/5 bg-white rounded-lg shadow-sm p-2 md:p-4 overflow-hidden">
              <Slideshow bureaus={bureauData} />
            </div>

            {/* Promotion section - larger */}
            <div className="lg:w-3/5 mt-2 lg:mt-0 bg-white rounded-lg shadow-md border-2 border-blue-200 overflow-hidden">
              <PromotionPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Routes>
      <Route
        path="/"
        element={
          showSplash ? (
            <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
              <div className="text-center animate-fadeIn">
                <div className="w-40 h-40 mx-auto mb-6">
                  <img src="/logo.png" alt="Federal Prison Commission Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-4xl font-bold text-blue-800 mb-2">BureauSync TV Display</h1>
                <p className="text-xl text-blue-600">Federal Prison Commission</p>
              </div>
            </div>
          ) : (
            <MainLayout />
          )
        }
      />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin" element={<PromotionAdmin />} />
    </Routes>
  )
}

export default App
