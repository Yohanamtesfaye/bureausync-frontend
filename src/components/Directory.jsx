"use client"

import { useState, useEffect } from "react"

const Directory = ({ bureaus, showOnlyFloors = null, alternateStyle = false, screenSize = "md" }) => {
  const [activeFloor, setActiveFloor] = useState(null)
  const [autoScrolling, setAutoScrolling] = useState(false)

  // Group bureaus by floor
  const groupedBureaus = bureaus.reduce((acc, bureau) => {
    const floor = bureau.floor
    if (!acc[floor]) {
      acc[floor] = []
    }
    acc[floor].push(bureau)
    return acc
  }, {})

  // Filter floors if showOnlyFloors is provided
  let floors = Object.keys(groupedBureaus).sort((a, b) => Number(a) - Number(b))

  if (showOnlyFloors && showOnlyFloors.length > 0) {
    floors = floors.filter((floor) => showOnlyFloors.includes(Number(floor)))
  }

  // Auto-cycle through floors every 10 seconds if no floor is actively selected
  useEffect(() => {
    if (activeFloor !== null) return // Don't auto-cycle if user has selected a floor

    const cycleTimer = setInterval(() => {
      setAutoScrolling(true)
      // Get next floor index, or go back to first floor if at the end
      const currentIndex = floors.findIndex((floor) => Number(floor) === activeFloor)
      const nextIndex = (currentIndex + 1) % floors.length
      setActiveFloor(Number(floors[nextIndex]))

      // Reset auto-scrolling flag after animation completes
      setTimeout(() => {
        setAutoScrolling(false)
      }, 500)
    }, 10000) // Change every 10 seconds

    return () => clearInterval(cycleTimer)
  }, [activeFloor, floors])

  return (
    <div className={`h-full overflow-y-auto ${alternateStyle ? "bg-blue-50" : ""}`}>
      <div className={`sticky top-0 z-10 bg-white border-b-2 border-blue-200 ${screenSize === "tv" ? "p-3" : "p-1"}`}>
        <div className="flex justify-center mb-1 gap-1 flex-wrap">
          {floors.map((floor) => (
            <button
              key={floor}
              className={`rounded-full font-bold transition-all mb-1 ${
                activeFloor === Number.parseInt(floor)
                  ? `${alternateStyle ? "bg-blue-700" : "bg-blue-600"} text-white shadow-md`
                  : `${alternateStyle ? "bg-blue-200" : "bg-blue-100"} text-blue-800 hover:bg-blue-200`
              } ${
                screenSize === "tv"
                  ? "text-xl px-4 py-2"
                  : screenSize === "lg"
                    ? "text-lg px-3 py-1.5"
                    : "text-sm px-2 py-1"
              }`}
              onClick={() => setActiveFloor(activeFloor === Number.parseInt(floor) ? null : Number.parseInt(floor))}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`${screenSize === "tv" ? "p-3 space-y-3" : screenSize === "lg" ? "p-2 space-y-2" : "p-1 space-y-1"}`}
      >
        {(activeFloor && floors.includes(activeFloor.toString()) ? [activeFloor.toString()] : floors).map((floor) => (
          <div key={floor} className="animate-fadeIn">
            <h3
              className={`font-bold text-blue-800 ${alternateStyle ? "bg-blue-100" : "bg-blue-50"} rounded-md flex items-center sticky top-[48px] z-10 ${
                screenSize === "tv"
                  ? "text-2xl mb-3 px-4 py-3"
                  : screenSize === "lg"
                    ? "text-xl mb-2 px-3 py-2"
                    : "text-sm mb-1 px-2 py-1"
              }`}
            >
              <span
                className={`${
                  alternateStyle ? "bg-blue-700" : "bg-blue-600"
                } text-white rounded-full inline-flex items-center justify-center mr-2 font-bold ${
                  screenSize === "tv"
                    ? "w-8 h-8 text-lg"
                    : screenSize === "lg"
                      ? "w-6 h-6 text-base"
                      : "w-5 h-5 text-xs"
                }`}
              >
                {floor}
              </span>
              {floor}ኛ ፎቅ
            </h3>

            <div
              className={`grid gap-${screenSize === "tv" ? "4" : screenSize === "lg" ? "3" : "1"} ${
                screenSize === "tv" || screenSize === "lg" ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {groupedBureaus[floor].map((bureau) => (
                <div
                  key={bureau.id}
                  className={`rounded-md ${
                    alternateStyle ? "bg-blue-50 border-blue-200" : "bg-white border-blue-100"
                  } border-2 shadow-sm hover:shadow-md transition-all hover:border-blue-300 card-hover ${
                    screenSize === "tv" ? "p-4" : screenSize === "lg" ? "p-3" : "p-2"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="overflow-hidden flex-1 pr-2">
                      <div className="flex items-center">
                        <span
                          className={`font-bold text-blue-800 mr-2 ${
                            screenSize === "tv" ? "text-lg" : screenSize === "lg" ? "text-base" : "text-sm"
                          }`}
                        >
                          ቢሮ {bureau.room}
                        </span>
                        <span
                          className={`text-gray-700 font-medium truncate ${
                            screenSize === "tv" ? "text-lg" : screenSize === "lg" ? "text-base" : "text-sm"
                          }`}
                        >
                          {bureau.name}
                        </span>
                      </div>
                      {bureau.description && (
                        <p
                          className={`font-medium text-gray-600 truncate ${
                            screenSize === "tv" ? "text-base" : screenSize === "lg" ? "text-sm" : "text-xs"
                          }`}
                        >
                          {bureau.description}
                        </p>
                      )}
                      {bureau.personnel && bureau.personnel.length > 0 && (
                        <div
                          className={`text-blue-600 font-medium ${
                            screenSize === "tv"
                              ? "text-sm mt-2"
                              : screenSize === "lg"
                                ? "text-xs mt-1.5"
                                : "text-xs mt-1"
                          }`}
                        >
                          <span className="font-bold">ሰራተኞች:</span> {bureau.personnel.map((p) => p.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${
                        alternateStyle ? "bg-blue-100" : "bg-blue-50"
                      } text-blue-800 rounded-full flex items-center justify-center font-bold ml-1 flex-shrink-0 border border-blue-200 ${
                        screenSize === "tv"
                          ? "min-w-[3rem] min-h-[3rem] w-12 h-12 text-xl"
                          : screenSize === "lg"
                            ? "min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 text-lg"
                            : "min-w-[2rem] min-h-[2rem] w-8 h-8 text-base"
                      }`}
                    >
                      {bureau.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar for auto-cycling */}
      <div className="progress-bar h-1"></div>
    </div>
  )
}

export default Directory
