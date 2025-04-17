"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Plus, Trash, Edit, Save, X, Award, Bell } from "lucide-react"
import { promotionData } from "../../data/promotionData"

const PromotionAdmin = ({ onLogout }) => {
  const [promotions, setPromotions] = useState(promotionData)
  const [activeTab, setActiveTab] = useState("featured")
  const [editMode, setEditMode] = useState(null)
  const [tempItem, setTempItem] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Load data from localStorage if available
  useEffect(() => {
    const savedPromotions = localStorage.getItem("bureauSyncPromotions")
    if (savedPromotions) {
      setPromotions(JSON.parse(savedPromotions))
    }
  }, [])

  // Save changes to localStorage
  const saveChanges = (newData) => {
    const updatedPromotions = { ...newData }
    setPromotions(updatedPromotions)
    localStorage.setItem("bureauSyncPromotions", JSON.stringify(updatedPromotions))

    // Show success message and clear it after 3 seconds
    setSuccessMessage("Changes saved successfully!")
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Edit featured promotion
  const handleEditFeatured = () => {
    setEditMode("featured")
    setTempItem({ ...promotions.featured })
  }

  // Save featured promotion
  const handleSaveFeatured = () => {
    const newData = { ...promotions, featured: tempItem }
    saveChanges(newData)
    setEditMode(null)
    setTempItem(null)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(null)
    setTempItem(null)
  }

  // Add new event
  const handleAddEvent = () => {
    const newEvent = {
      title: "New Event",
      day: new Date().getDate().toString(),
      month: new Date().toLocaleString("default", { month: "short" }),
      time: "9:00 AM - 11:00 AM",
      location: "Location",
    }

    const newEvents = [...promotions.events, newEvent]
    saveChanges({ ...promotions, events: newEvents })
  }

  // Edit event
  const handleEditEvent = (index) => {
    setEditMode(`event-${index}`)
    setTempItem({ ...promotions.events[index] })
  }

  // Save event
  const handleSaveEvent = (index) => {
    const newEvents = [...promotions.events]
    newEvents[index] = tempItem
    saveChanges({ ...promotions, events: newEvents })
    setEditMode(null)
    setTempItem(null)
  }

  // Delete event
  const handleDeleteEvent = (index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const newEvents = promotions.events.filter((_, i) => i !== index)
      saveChanges({ ...promotions, events: newEvents })
    }
  }

  // Add new achievement
  const handleAddAchievement = () => {
    const newAchievement = {
      title: "New Achievement",
      description: "Description of the achievement",
    }

    const newAchievements = [...promotions.achievements, newAchievement]
    saveChanges({ ...promotions, achievements: newAchievements })
  }

  // Edit achievement
  const handleEditAchievement = (index) => {
    setEditMode(`achievement-${index}`)
    setTempItem({ ...promotions.achievements[index] })
  }

  // Save achievement
  const handleSaveAchievement = (index) => {
    const newAchievements = [...promotions.achievements]
    newAchievements[index] = tempItem
    saveChanges({ ...promotions, achievements: newAchievements })
    setEditMode(null)
    setTempItem(null)
  }

  // Delete achievement
  const handleDeleteAchievement = (index) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      const newAchievements = promotions.achievements.filter((_, i) => i !== index)
      saveChanges({ ...promotions, achievements: newAchievements })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">BureauSync Admin</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
            <button onClick={() => setSuccessMessage("")} className="text-green-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("featured")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "featured"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Featured Promotion
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "achievements"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Achievements
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Featured Promotion Tab */}
            {activeTab === "featured" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-600" />
                    Featured Promotion
                  </h2>
                  {editMode !== "featured" ? (
                    <button
                      onClick={handleEditFeatured}
                      className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveFeatured}
                        className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editMode === "featured" ? (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={tempItem.title}
                        onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="text"
                        value={tempItem.date}
                        onChange={(e) => setTempItem({ ...tempItem, date: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={tempItem.description}
                        onChange={(e) => setTempItem({ ...tempItem, description: e.target.value })}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={tempItem.location}
                        onChange={(e) => setTempItem({ ...tempItem, location: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={tempItem.image}
                        onChange={(e) => setTempItem({ ...tempItem, image: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="/placeholder.svg?height=300&width=500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-1/3 relative">
                        <div className="aspect-video bg-blue-200 rounded-lg overflow-hidden">
                          <img
                            src={promotions.featured.image || `/placeholder.svg?height=300&width=500`}
                            alt={promotions.featured.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          አዲስ!
                        </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <h3 className="text-2xl font-bold text-blue-800 mb-2">{promotions.featured.title}</h3>
                        <p className="text-blue-700 mb-3 flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          {promotions.featured.date}
                        </p>
                        <p className="text-gray-700 text-lg">{promotions.featured.description}</p>
                        {promotions.featured.location && (
                          <p className="mt-3 text-blue-700 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            {promotions.featured.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Events
                  </h2>
                  <button
                    onClick={handleAddEvent}
                    className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </button>
                </div>

                <div className="space-y-4">
                  {promotions.events.map((event, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      {editMode === `event-${index}` ? (
                        <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={tempItem.title}
                              onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                              <input
                                type="text"
                                value={tempItem.day}
                                onChange={(e) => setTempItem({ ...tempItem, day: e.target.value })}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                              <input
                                type="text"
                                value={tempItem.month}
                                onChange={(e) => setTempItem({ ...tempItem, month: e.target.value })}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                              type="text"
                              value={tempItem.time}
                              onChange={(e) => setTempItem({ ...tempItem, time: e.target.value })}
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={tempItem.location}
                              onChange={(e) => setTempItem({ ...tempItem, location: e.target.value })}
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              onClick={() => handleSaveEvent(index)}
                              className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-800 rounded-lg p-2 flex flex-col items-center justify-center min-w-[60px]">
                              <span className="text-xl font-bold">{event.day}</span>
                              <span className="text-sm">{event.month}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-blue-800">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.time}</p>
                              <p className="text-sm text-gray-700 mt-1">{event.location}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditEvent(index)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Achievements
                  </h2>
                  <button
                    onClick={handleAddAchievement}
                    className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Achievement
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promotions.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all"
                    >
                      {editMode === `achievement-${index}` ? (
                        <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={tempItem.title}
                              onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={tempItem.description}
                              onChange={(e) => setTempItem({ ...tempItem, description: e.target.value })}
                              rows={3}
                              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              onClick={() => handleSaveAchievement(index)}
                              className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center relative">
                          <div className="absolute top-0 right-0 flex space-x-1">
                            <button
                              onClick={() => handleEditAchievement(index)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAchievement(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="inline-block bg-blue-600 text-white rounded-full p-2 mb-3">
                            <Award className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-blue-800 mb-2">{achievement.title}</h4>
                          <p className="text-sm text-gray-700">{achievement.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PromotionAdmin
