"use client"

import { useState, useEffect, useMemo } from "react"
import { Phone, MapPin, Briefcase, Award, Star } from "lucide-react"
import { leadershipData } from "../data/leadershipData"

const Slideshow = ({ bureaus }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState("next")
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add Vision and Mission slide and Leadership slide (removed Promotion slide)
  const slides = useMemo(
    () => [
      {
        type: "vision-mission",
        content: {
          vision:
            "በ2022ዓ/ም የሕግ የበላይነትና የእስረኞች ሰብዓዊ መብት የተከበረበት፣ የታረመና የታነፀ፣ ህግ አክባሪና አምራች ዜጋ የሚፈራበት በምስራቅ አፍሪካ ተምሳሌት/ሞዴል/ ማረሚያ ቤት ዕውን ማድረግ፤",
          mission:
            "በፍርድ ቤት ውሳኔ ወይም ትዕዛዝ መሠረት ወደ ማረፊያና ማረሚያ ቤት የሚላኩ የቀጠሮ እስረኞችና ታራሚዎችን በመቀበል የተጠናከረ የጥበቃ ደህንነትና አስተዳደር፣ የመሠረታዊ ፍላጎት አቅርቦት፣ የተሃድሶና ልማት አገልግሎት በመስጠት ታራሚዎች የወንጀል አስከፊነትን ተረድተው አምራችና ህግ አክባሪ ዜጋ እንዲሆኑ በማድረግ ኮሚሽኑ ወንጀልን በመከላከልና የህዝብን ሠላምና ደህንነት በማረጋገጥ ረገድ የበኩሉን ድርሻ መወጣት፡፡",
          values: ["ታራሚዎችን በሰብዓዊ ክብር መያዝ", "ለህግ ተገዢ መሆን", "ግልጽነትና ተጠያቂነት", "ቅንነት", "ፍትሃዊነት"],
        },
      },
      {
        type: "leadership",
        content: {
          title: "የኮሚሽኑ ከፍተኛ አመራሮች",
          leaders: leadershipData,
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

  // Get slide title based on slide type
  const getSlideTitle = (slide) => {
    switch (slide.type) {
      case "vision-mission":
        return "ራዕይና ተልዕኮ"
      case "leadership":
        return "የኮሚሽኑ ከፍተኛ አመራሮች"
      default:
        return "የቢሮ መረጃ"
    }
  }

  // Determine leader card width based on screen size
  const getLeaderCardWidth = () => {
    if (windowWidth >= 1536) return "w-[18%]" // 2xl
    if (windowWidth >= 1280) return "w-[22%]" // xl
    if (windowWidth >= 1024) return "w-[30%]" // lg
    if (windowWidth >= 768) return "w-[45%]" // md
    return "w-[30%]" // sm and below
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 text-blue-800 text-center">
        {getSlideTitle(currentSlide)}
      </h2>

      <div className="flex-1 flex items-center justify-center relative">
        <button
          onClick={goToPrevSlide}
          className="absolute left-2 md:left-4 z-10 bg-white/80 hover:bg-white text-blue-800 rounded-full p-1 md:p-2 shadow-md transition-all hover:scale-110"
          aria-label="ቀዳሚ ስሌይድ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 md:w-6 md:h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          className={`w-full h-full flex items-center justify-center transition-all duration-800 ${
            isTransitioning
              ? direction === "next"
                ? "opacity-0 transform translate-x-10"
                : "opacity-0 transform -translate-x-10"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          {currentSlide.type === "vision-mission" ? (
            <div className="w-full max-w-4xl p-3 md:p-8 text-center rounded-lg border border-blue-200 bg-white shadow-xl animate-fadeIn overflow-y-auto">
              <div className="mb-4 md:mb-8">
                <div className="bg-blue-600 text-white inline-block px-3 md:px-6 py-1 md:py-2 rounded-full text-sm md:text-lg font-medium mb-2 md:mb-4">
                  ራዕይ
                </div>
                <p className="text-base  text-blue-800">{currentSlide.content.vision}</p>
              </div>

              <div className="mb-4 md:mb-8">
                <div className="bg-blue-600 text-white inline-block px-3 md:px-6 py-1 md:py-2 rounded-full text-sm md:text-lg font-medium mb-2 md:mb-4">
                  ተልዕኮ
                </div>
                <p className="text-base  lg:text- text-blue-800">{currentSlide.content.mission}</p>
              </div>
            </div>
          ) : currentSlide.type === "leadership" ? (
            <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn overflow-y-auto">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-blue-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-40 md:w-80 h-40 md:h-80 bg-blue-100 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="relative z-10 w-full max-w-5xl">
                <div className="flex flex-col items-center mb-3 md:mb-6">
                  <div className="bg-white text-blue-800 px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-lg font-medium mb-3 md:mb-6 shadow-lg flex items-center">
                    <Award className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
                    ዋና መስሪያ ቤት ስትራቴጂክ አመራሮችን
                  </div>
                </div>

                <div className="flex flex-wrap justify-center items-stretch gap-2 md:gap-4 w-full">
                  {currentSlide.content.leaders.map((leader, index) => (
                    <div
                      key={leader.id}
                      className={`${getLeaderCardWidth()} bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-blue-100 flex flex-col`}
                    >
                      {/* Leader image at top */}
                      <div className="relative w-full pt-[100%]">
                        {" "}
                        {/* Aspect ratio 1:1 */}
                        <img
                          src={leader.image || `/placeholder.svg?height=300&width=300`}
                          alt={leader.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `https://i.pravatar.cc/300?img=${index + 20}`
                          }}
                        />
                        <div className="absolute top-1 md:top-2 right-1 md:right-2">
                          <div className="bg-blue-600 text-white p-1 rounded-full">
                            <Star className="w-3 h-3 md:w-4 md:h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Leader details below image */}
                      <div className="p-2 md:p-3 text-center bg-gradient-to-b from-blue-50 to-white flex-1 flex flex-col justify-between">
                        <h5 className="text-sm md:text-lg font-bold text-blue-800 mb-1 line-clamp-2">{leader.name}</h5>
                        <div className="text-blue-600 text-xs md:text-sm font-medium line-clamp-2">
                          {leader.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl p-3 md:p-8 rounded-lg border border-blue-200 bg-white shadow-xl overflow-y-auto">
              <div className="text-center mb-4 md:mb-8">
                <div className="bg-blue-50 text-blue-800 inline-block px-2 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium mb-2 md:mb-4">
                  {currentSlide.content.floor}ኛ ፎቅ , ክፍል {currentSlide.content.room}
                </div>
                <h3 className="text-xl md:text-xl lg:text-xl font-bold text-blue-800 mb-2 md:mb-3">
                  {currentSlide.content.name}
                </h3>
                {currentSlide.content.description && (
                  <p className="text-sm md:text-lg lg:text-xl text-gray-600">{currentSlide.content.description}</p>
                )}
              </div>

              {currentSlide.content.personnel && currentSlide.content.personnel.length > 0 && (
                <div className="border-t border-blue-100 pt-3 md:pt-6 mt-4 md:mt-8">
                  <h4 className="text-lg md:text-x=lg font-medium text-center mb-3 md:mb-6 text-blue-800">ሰራተኞች</h4>
                  <div className="space-y-3 md:space-y-6">
                    {currentSlide.content.personnel.map((person, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row bg-blue-50 mb-3 md:mb-5 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                      >
                        {/* Larger image on the left */}
                        <div className="w-full md:w-1/3 relative">
                          <img
                            src={person.image || `/placeholder.svg?height=300&width=300`}
                            alt={person.name}
                            className="w-full h-full object-cover aspect-square"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = `https://i.pravatar.cc/300?img=${index + 10}`
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/70 to-transparent p-1 md:p-2">
                            <p className="text-white font-bold text-sm md:text-md">{person.name}</p>
                          </div>
                        </div>

                        {/* Details on the right */}
                        <div className="w-full md:w-2/3 p-2 md:p-6 flex flex-col justify-center">
                          <h5 className="text-base md:text-2xl font-bold text-blue-800 mb-1 md:mb-2">{person.name}</h5>

                          <div className="space-y-1 md:space-y-3">
                            <div className="flex items-center text-blue-700">
                              <Briefcase className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                              <span className="text-sm md:text-lg">{person.title}</span>
                            </div>

                            <div className="flex items-center text-blue-700">
                              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                              <span className="text-sm md:text-lg">ክፍል {currentSlide.content.room}</span>
                            </div>

                            <div className="flex items-center text-blue-700">
                              <Phone className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                              <span className="text-sm md:text-lg">{generatePhoneNumber(index)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={goToNextSlide}
          className="absolute right-2 md:right-4 z-10 bg-white/80 hover:bg-white text-blue-800 rounded-full p-1 md:p-2 shadow-md transition-all hover:scale-110"
          aria-label="ቀጣይ ስሌይድ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 md:w-6 md:h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-2 md:mt-4 flex justify-center space-x-1 md:space-x-2 flex-wrap">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-600 w-4 md:w-6" : "bg-blue-200 hover:bg-blue-400"
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
