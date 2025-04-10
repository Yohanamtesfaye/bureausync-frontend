import { useState, useEffect } from "react"
import Logo from "../assets/logo.jpg"

const Header = ({ currentTime }) => {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour < 12) {
      setGreeting("እንዴት አደራቹ")
    } else if (hour < 18) {
      setGreeting("እንዴት ዋላቹ")
    } else {
      setGreeting("እንዴት አመሻቹ")
    }
  }, [currentTime])

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const formatTime = (date) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
    return date.toLocaleTimeString("en-US", options)
  }

  return (
    <div className="bg-white border-b border-blue-100 p-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div className="w-12 h-12 mr-3">
          <img src={Logo} alt="" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-800">ፌዴራል ማረሚያ ቤት ኮሚሽን የቃሊቲ ማረሚያ ማዕከል</h1>
          <p className="text-sm text-blue-600">{greeting}, እንኳን ወደ ተቋማችን በሰላም መጡ</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-blue-800">{formatTime(currentTime)}</div>
        <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
      </div>
    </div>
  )
}

export default Header
