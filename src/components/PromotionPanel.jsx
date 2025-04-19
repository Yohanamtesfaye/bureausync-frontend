"use client"

import { Bell, Calendar, MapPin, Trophy } from "lucide-react"
import { promotionData } from "../data/promotionData"
import { useEffect, useState } from "react"

const PromotionPanel = () => {
  const [promotions, setPromotions] = useState(promotionData)

  // Load data from localStorage if available (for admin updates)
  useEffect(() => {
    const savedPromotions = localStorage.getItem("bureauSyncPromotions")
    if (savedPromotions) {
      setPromotions(JSON.parse(savedPromotions))
    }
  }, [])

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white rounded-lg shadow-sm">
      {/* Promotion Header */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-blue-100">
        <div className="text-center">
          <div className="bg-blue-600 text-white inline-block px-6 py-2 rounded-full text-lg font-medium">
            <Bell className="w-5 h-5 inline-block mr-2" />
            ማስታወቂያዎች እና ዝግጅቶች
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Featured Promotion */}
        {promotions.featured && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-md">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <div className="aspect-video bg-blue-200 rounded-lg overflow-hidden">
                  <img
                    src={promotions.featured.image || `/placeholder.svg?height=300&width=500`}
                    alt={promotions.featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg pulse">
                  አዲስ!
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{promotions.featured.title}</h3>
                <p className="text-blue-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {promotions.featured.date}
                </p>
                <p className="text-gray-700">{promotions.featured.description}</p>
                {promotions.featured.location && (
                  <p className="mt-2 text-blue-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {promotions.featured.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            መጪ ዝግጅቶች
          </h3>
          <div className="space-y-3">
            {promotions.events.map((event, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all card-hover"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-lg p-2 flex flex-col items-center justify-center min-w-[50px]">
                    <span className="text-lg font-bold">{event.day}</span>
                    <span className="text-xs">{event.month}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800">{event.title}</h4>
                    <p className="text-xs text-gray-600">{event.time}</p>
                    <p className="text-xs text-gray-700">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            የቅርብ ጊዜ ስኬቶች
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {promotions.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-blue-50 to-white p-3 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all card-hover"
              >
                <div className="text-center">
                  <div className="inline-block bg-blue-600 text-white rounded-full p-1 mb-2">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-blue-800 mb-1">{achievement.title}</h4>
                  <p className="text-xs text-gray-700">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionPanel
