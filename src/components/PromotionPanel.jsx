"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Award, ChevronRight } from "lucide-react"

const PromotionPanel = () => {
  const [promotions, setPromotions] = useState({
    featured: null,
    events: [],
    achievements: [],
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  const BASE_URL = "http://localhost:3001"

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    let isMounted = true // Flag to track component mount status

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError("")

        const [featuredRes, eventsRes, achievementsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/public/promotions/featured`),
          fetch(`${BASE_URL}/api/public/events`),
          fetch(`${BASE_URL}/api/public/achievements`),
        ])

        if (!isMounted) return

        if (!featuredRes.ok || !eventsRes.ok || !achievementsRes.ok) {
          throw new Error(`Failed to fetch data: ${featuredRes.status} ${eventsRes.status} ${achievementsRes.status}`)
        }

        const [featured, events, achievements] = await Promise.all([
          featuredRes.json(),
          eventsRes.json(),
          achievementsRes.json(),
        ])

        if (isMounted) {
          setPromotions({
            featured: featured || null,
            events: events || [],
            achievements: achievements || [],
          })
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch error:", err)
          setError("Failed to load data. Please try again later.")

          // Set mock data for development/preview
          setPromotions({
            featured: {
              title: "Test Promotion",
              date: "2025-05-10",
              description: "Test description",
              location: "Test location",
              image: null,
            },
            events: [
              {
                title: "Test Event",
                day: "10",
                month: "May",
                time: "9:00 AM",
                location: "Test Location",
              },
            ],
            achievements: [
              {
                title: "Test Achievement",
                description: "Test achievement description",
              },
            ],
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array ensures this runs only on mount

  // Determine grid columns based on screen width
  const getGridCols = (itemCount) => {
    if (windowWidth >= 1536) return "grid-cols-2" // 2xl
    if (windowWidth >= 1280) return "grid-cols-2" // xl
    if (windowWidth >= 1024) return "grid-cols-2" // lg
    if (windowWidth >= 768) return "grid-cols-2" // md
    return itemCount > 1 ? "grid-cols-2" : "grid-cols-1" // sm and below
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 py-6 md:py-12 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading promotions...
        </div>
      </div>
    )
  }

  // Render error state
  if (error && !promotions.featured && promotions.events.length === 0 && promotions.achievements.length === 0) {
    return (
      <div className="bg-gray-50 py-6 md:py-12 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-md flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      </div>
    )
  }

  // Main render
  return (
    <div className="bg-gray-50 py-4 md:py-6 lg:py-8 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Featured Promotion */}
        {promotions.featured && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-2xl font-bold text-blue-800 mb-3 md:mb-4">Featured Promotion</h2>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 md:p-4 lg:p-6 border border-blue-200 shadow-md">
              <div className=" items-center">
                <div className=" relative">
                  <div className="aspect-video h-44 w-full bg-blue-200 rounded-lg overflow-hidden">
                    <img
                      src={
                        promotions.featured.image
                          ? `${BASE_URL}${promotions.featured.image}`
                          : `/placeholder.svg?height=300&width=500`
                      }
                      alt={promotions.featured.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-blue-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg">
                    አዲስ!
                  </div>
                </div>
                <div className="w-full">
                  <h3 className=" lg:text-lg font-bold text-blue-800 mb-1 md:mb-2">
                    {promotions.featured.title}
                  </h3>
                  <p className="text-blue-700 text-sm mb-2 md:mb-3 flex items-center">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    {promotions.featured.date}
                  </p>
                  <p className="text-gray-700 text-sm md:text-base ">{promotions.featured.description}</p>
                  {promotions.featured.location && (
                    <p className="mt-2 md:mt-3 text-blue-700 flex items-center">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                      {promotions.featured.location}
                    </p>
                  )}
                  {promotions.featured.cta && (
                    <a
                      href={promotions.featured.cta}
                      className="mt-3 md:mt-4 inline-flex items-center px-3 md:px-4 py-1 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
                    >
                      Learn More
                      <ChevronRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events */}
        {promotions.events.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-2xl font-bold text-blue-800 mb-3 md:mb-4">Upcoming Events</h2>
            <div className={`grid ${getGridCols(promotions.events.length)} gap-3 md:gap-4 lg:gap-6`}>
              {promotions.events.map((event, index) => (
                <div
                  key={`event-${index}`}
                  className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-1 md:p-2 flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px]">
                      <span className="text-lg md:text-xl font-bold">{event.day}</span>
                      <span className="text-xs md:text-sm">{event.month}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-800 text-sm md:text-base">{event.title}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{event.time}</p>
                      <p className="text-xs md:text-sm text-gray-700 mt-1">{event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {promotions.achievements.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl lg:text-2xl font-bold text-blue-800 mb-3 md:mb-4">Achievements</h2>
            <div className={`grid ${getGridCols(promotions.achievements.length)} gap-3 md:gap-4 lg:gap-6`}>
              {promotions.achievements.map((achievement, index) => (
                <div
                  key={`achievement-${index}`}
                  className="bg-gradient-to-b from-blue-50 to-white p-3 md:p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="inline-block bg-blue-600 text-white rounded-full p-1 md:p-2 mb-2 md:mb-3">
                    <Award className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <h4 className="font-bold text-blue-800 mb-1 md:mb-2 text-sm md:text-base">{achievement.title}</h4>
                  <p className="text-xs md:text-sm text-gray-700">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromotionPanel
