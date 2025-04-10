"use client"

import { useState, useEffect } from "react"

const Slideshow = ({ bureaus }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState("next")

  useEffect(() => {
    if (bureaus.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setDirection("next")

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bureaus.length)
        setIsTransitioning(false)
      }, 800) // Wait for transition
    }, 10000) // Change slide every 10 seconds

    return () => clearInterval(interval)
  }, [bureaus])

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "next" : "prev")
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 800)
  }

  const goToPrevSlide = () => {
    setDirection("prev")
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? bureaus.length - 1 : prevIndex - 1))
      setIsTransitioning(false)
    }, 800)
  }

  const goToNextSlide = () => {
    setDirection("next")
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bureaus.length)
      setIsTransitioning(false)
    }, 800)
  }

  if (bureaus.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-2xl text-gray-400">No bureaus to display</p>
      </div>
    )
  }

  const currentBureau = bureaus[currentIndex]

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">የቢሮ መረጃ</h2>

      <div className="flex-1 flex items-center justify-center relative">
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 z-10 bg-white/80 hover:bg-white text-blue-800 rounded-full p-2 shadow-md transition-all hover:scale-110"
          aria-label="ቀዳሚ ስሌይድ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          className={`max-w-4xl w-full p-10 rounded-lg border border-blue-200 bg-white shadow-xl transition-all duration-800 ${
            isTransitioning
              ? direction === "next"
                ? "opacity-0 transform translate-x-10"
                : "opacity-0 transform -translate-x-10"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          <div className="text-center mb-8">
            <div className="bg-blue-50 text-blue-800 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
            {currentBureau.floor}ኛ ፎቅ , ክፍል {currentBureau.room}
            </div>
            <h3 className="text-5xl font-bold text-blue-800 mb-3">{currentBureau.name}</h3>
            {currentBureau.description && <p className="text-xl text-gray-600">{currentBureau.description}</p>}
          </div>

          {currentBureau.personnel && currentBureau.personnel.length > 0 && (
            <div className="border-t border-blue-100 pt-6 mt-8">
              <h4 className="text-2xl font-medium text-center mb-6 text-blue-800"> ሰራተኞች</h4>
              <div className="flex flex-wrap justify-center gap-6">
                {currentBureau.personnel.map((person, index) => (
                  <div key={index} className="text-center">
                    <div className="w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-blue-200 shadow-md">
                      <img
                        src={person.image || "/placeholder.svg"}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = `https://i.pravatar.cc/200?img=${index + 10}`
                        }}
                      />
                    </div>
                    <p className="font-medium text-blue-800">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={goToNextSlide}
          className="absolute right-4 z-10 bg-white/80 hover:bg-white text-blue-800 rounded-full p-2 shadow-md transition-all hover:scale-110"
          aria-label="ቀጣይ ስሌይድ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex justify-center space-x-2">
        {bureaus.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600 w-6"
                : "bg-blue-200 hover:bg-blue-400"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`ወደ ስሌይድ ${index + 1} ሂድ`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow
