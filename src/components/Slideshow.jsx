"use client"

import { useState, useEffect, useMemo } from "react"
import { Phone, MapPin, Briefcase } from 'lucide-react'

const Slideshow = ({ bureaus }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState("next")

  // Add Vision and Mission slide
  const slides = useMemo(
    () => [
      {
        type: "vision-mission",
        content: {
          vision: "በ2022ዓ/ም የሕግ የበላይነትና የእስረኞች ሰብዓዊ መብት የተከበረበት፣ የታረመና የታነፀ፣ ህግ አክባሪና አምራች ዜጋ የሚፈራበት በምስራቅ አፍሪካ ተምሳሌት/ሞዴል/ ማረሚያ ቤት ዕውን ማድረግ፤",
          mission: " በፍርድ ቤት ውሳኔ ወይም ትዕዛዝ መሠረት ወደ ማረፊያና ማረሚያ ቤት የሚላኩ የቀጠሮ እስረኞችና ታራሚዎችን በመቀበል የተጠናከረ የጥበቃ ደህንነትና አስተዳደር፣ የመሠረታዊ ፍላጎት አቅርቦት፣ የተሃድሶና ልማት አገልግሎት በመስጠት ታራሚዎች የወንጀል አስከፊነትን ተረድተው አምራችና ህግ አክባሪ ዜጋ እንዲሆኑ በማድረግ ኮሚሽኑ ወንጀልን በመከላከልና የህዝብን ሠላምና ደህንነት በማረጋገጥ ረገድ የበኩሉን ድርሻ መወጣት፡፡",
          // values: ["ታራሚዎችን በሰብዓዊ ክብር መያዝ", "ለህግ ተገዢ መሆን", "ግልጽነትና ተጠያቂነት", "ቅንነት", "ፍትሃዊነት"],
        },
      },
      ...bureaus.map((bureau) => ({ type: "bureau", content: bureau })),
    ],
    [bureaus],
  )

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setDirection("next")

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
        setIsTransitioning(false)
      }, 800) // Wait for transition
    }, 15000) // Change slide every 15 seconds (increased time for reading)

    return () => clearInterval(interval)
  }, [slides.length])

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
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
      setIsTransitioning(false)
    }, 800)
  }

  const goToNextSlide = () => {
    setDirection("next")
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
      setIsTransitioning(false)
    }, 800)
  }

  if (slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-2xl text-gray-400">No content to display</p>
      </div>
    )
  }

  const currentSlide = slides[currentIndex]

  // Generate a consistent phone number for each person based on their index
  const generatePhoneNumber = (index) => {
    return `+251 9${index + 1} ${(index + 10) * 111} ${(index + 5) * 111}`
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">
        {currentSlide.type === "vision-mission" ? "ራዕይና ተልዕኮ" : "ወዴት መሄድ ይፈልጋሉ"}
      </h2>

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
          {currentSlide.type === "vision-mission" ? (
            <div className="text-center animate-fadeIn">
              <div className="mb-8">
                <div className="bg-blue-600 text-white inline-block px-6 py-2 rounded-full text-lg font-medium mb-4">
                  ራዕይ
                </div>
                <p className="text-2xl text-blue-800">{currentSlide.content.vision}</p>
              </div>

              <div className="mb-8">
                <div className="bg-blue-600 text-white inline-block px-6 py-2 rounded-full text-lg font-medium mb-4">
                  ተልዕኮ
                </div>
                <p className="text-2xl text-blue-800">{currentSlide.content.mission}</p>
              </div>

              {/* <div>
                <div className="bg-blue-600 text-white inline-block px-6 py-2 rounded-full text-lg font-medium mb-4">
                  እሴቶች
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {currentSlide.content.values.map((value, idx) => (
                    <div key={idx} className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg shadow-sm">
                      {value}
                    </div>
                  ))}
                </div> */}
              {/* </div> */}
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="bg-blue-50 text-blue-800 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {currentSlide.content.floor}ኛ ፎቅ , ክፍል {currentSlide.content.room}
                </div>
                <h3 className="text-4xl font-bold text-blue-800 mb-3">{currentSlide.content.name}</h3>
                {currentSlide.content.description && (
                  <p className="text-xl text-gray-600">{currentSlide.content.description}</p>
                )}
              </div>

              {currentSlide.content.personnel && currentSlide.content.personnel.length > 0 && (
                <div className="border-t border-blue-100 pt-6 mt-8">
                  <h4 className="text-2xl font-medium text-center mb-6 text-blue-800">ሰራተኞች</h4>
                  <div className="space-y-6">
                    {currentSlide.content.personnel.map((person, index) => (
                      <div
                        key={index}
                        className="flex bg-blue-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                      >
                        {/* Larger image on the left */}
                        <div className="w-1/3 relative">
                          <img
                            src={person.image || `/placeholder.svg?height=300&width=300`}
                            alt={person.name}
                            className="w-full h-full object-cover aspect-square"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = `https://i.pravatar.cc/300?img=${index + 10}`
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/70 to-transparent p-2">
                            <p className="text-white font-bold text-lg">{person.name}</p>
                          </div>
                        </div>

                        {/* Details on the right */}
                        <div className="w-2/3 p-6 flex flex-col justify-center">
                          <h5 className="text-2xl font-bold text-blue-800 mb-2">{person.name}</h5>
                          
                          <div className="space-y-3">
                            <div className="flex items-center text-blue-700">
                              <Briefcase className="w-5 h-5 mr-2" />
                              <span className="text-lg">{person.title}</span>
                            </div>
                            
                            <div className="flex items-center text-blue-700">
                              <MapPin className="w-5 h-5 mr-2" />
                              <span className="text-lg">ክፍል {currentSlide.content.room}</span>
                            </div>
                            
                            <div className="flex items-center text-blue-700">
                              <Phone className="w-5 h-5 mr-2" />
                              <span className="text-lg">{generatePhoneNumber(index)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
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
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-600 w-6" : "bg-blue-200 hover:bg-blue-400"
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
