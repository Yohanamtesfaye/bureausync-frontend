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
  const [activeSlide, setActiveSlide] = useState(0) // 0: Slideshow, 1: Promotion
  const [slideDirection, setSlideDirection] = useState("right")
  const [isMobile, setIsMobile] = useState(false)
  const [activeDirectoryTab, setActiveDirectoryTab] = useState(0)

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Hide splash screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-cycle slides every 20 seconds
  useEffect(() => {
    if (showSplash) return

    const cycleTimer = setInterval(() => {
      setSlideDirection("right")
      setActiveSlide((prev) => (prev + 1) % 2)
    }, 20000)

    return () => clearInterval(cycleTimer)
  }, [showSplash])

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

  // Handle manual slide change
  const handleSlideChange = (index) => {
    if (index !== activeSlide) {
      setSlideDirection(index > activeSlide ? "right" : "left")
      setActiveSlide(index)
    }
  }

  // Main layout for non-admin routes
  const MainLayout = () => (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden flex">
        {/* Fixed Directory Section */}
        <div className="w-1/3 border-r border-blue-200 flex flex-col">
          <div className="flex border-b-2 border-blue-200">
            <button
              onClick={() => setActiveDirectoryTab(0)}
              className={`flex-1 py-2 text-sm font-bold ${
                activeDirectoryTab === 0 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              ታችኛ ፎቆች
            </button>
            <button
              onClick={() => setActiveDirectoryTab(1)}
              className={`flex-1 py-2 text-sm font-bold ${
                activeDirectoryTab === 1 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              ላይኛ ፎቆች
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <Directory bureaus={bureauData} showOnlyFloors={activeDirectoryTab === 0 ? lowerFloors : upperFloors} />
          </div>
        </div>

        {/* Slideshow and Promotion Section */}
        <div className="flex-1 relative">
          {/* Auto-cycling indicator */}
          <div className="absolute top-2 right-2 z-20">
            <div className="w-2 h-2 rounded-full bg-blue-600 opacity-75 animate-pulse"></div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeSlide ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Slideshow Slide - Only show when active */}
          {activeSlide === 0 && (
            <div
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                activeSlide === 0 ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="h-full">
                <Slideshow bureaus={bureauData} />
              </div>
            </div>
          )}

          {/* Promotion Panel Slide - Only show when active */}
          {activeSlide === 1 && (
            <div
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                activeSlide === 1 ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="h-full">
                <PromotionPanel />
              </div>
            </div>
          )}
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