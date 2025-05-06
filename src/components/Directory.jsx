"use client"

import { useState, useEffect } from "react"

const Directory = ({ bureaus, showOnlyFloors = null, alternateStyle = false }) => {
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
      <div className="p-1 sticky top-0 z-10 bg-white border-b-2 border-blue-200">
        <div className="flex justify-center mb-1 gap-1 flex-wrap">
          {floors.map((floor) => (
            <button
              key={floor}
              className={`px-2 py-1 rounded-full text-sm font-bold transition-all mb-1 ${
                activeFloor === Number.parseInt(floor)
                  ? `${alternateStyle ? "bg-blue-700" : "bg-blue-600"} text-white shadow-md`
                  : `${alternateStyle ? "bg-blue-200" : "bg-blue-100"} text-blue-800 hover:bg-blue-200`
              }`}
              onClick={() => setActiveFloor(activeFloor === Number.parseInt(floor) ? null : Number.parseInt(floor))}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      <div className="p-1 space-y-1">
        {(activeFloor && floors.includes(activeFloor.toString()) ? [activeFloor.toString()] : floors).map((floor) => (
          <div key={floor} className="animate-fadeIn">
            <h3
              className={`text-sm font-bold mb-1 text-blue-800 ${
                alternateStyle ? "bg-blue-100" : "bg-blue-50"
              } px-2 py-1 rounded-md flex items-center sticky top-[48px] z-10`}
            >
              <span
                className={`${
                  alternateStyle ? "bg-blue-700" : "bg-blue-600"
                } text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs font-bold`}
              >
                {floor}
              </span>
              {floor}ኛ ፎቅ
            </h3>

            <div className="grid grid-cols-1 gap-1">
              {groupedBureaus[floor].map((bureau) => (
                <div
                  key={bureau.id}
                  className={`p-2 rounded-md ${
                    alternateStyle ? "bg-blue-50 border-blue-200" : "bg-white border-blue-100"
                  } border-2 shadow-sm hover:shadow-md transition-all hover:border-blue-300 card-hover`}
                >
                  <div className="flex justify-between items-center">
                    <div className="overflow-hidden flex-1 pr-2">
                      <div className="flex items-center">
                        <span className="font-bold text-blue-800 text-sm mr-2">ቢሮ {bureau.room}</span>
                        <span className="text-gray-700 text-sm font-medium truncate">{bureau.name}</span>
                      </div>
                      {bureau.description && (
                        <p className="text-xs font-medium text-gray-600 truncate">{bureau.description}</p>
                      )}
                      {bureau.personnel && bureau.personnel.length > 0 && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          <span className="font-bold">ሰራተኞች:</span> {bureau.personnel.map((p) => p.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${
                        alternateStyle ? "bg-blue-100" : "bg-blue-50"
                      } text-blue-800 rounded-full min-w-[2rem] min-h-[2rem] w-8 h-8 flex items-center justify-center font-bold text-base ml-1 flex-shrink-0 border border-blue-200`}
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
