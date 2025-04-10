import { Clock, Info, Calendar, MapPin } from "lucide-react"

const InfoPanel = ({ currentTime }) => {
  return (
    <div className="p-4 bg-gradient-to-b from-white to-blue-50">
      <div className="space-y-4">
        <div className="border-b border-blue-100 pb-3">
          <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-600" />
            እንኳን ደህና መጡ
          </h3>
          <p className="text-xs text-gray-700 mt-1">እንኳን ወደ ፌዴራል እስር ቤት ኮሚሽን በሰላም መጡ</p>
        </div>

        <div className="border-b border-blue-100 pb-3">
          <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            የሕንፃ ሰዓት
          </h3>
          <p className="text-xs text-gray-700 mt-1">ክፍት 8 ጠዋት – 5 ከሰዓት</p>
        </div>

      

    </div>
    </div>
  )
}

export default InfoPanel
