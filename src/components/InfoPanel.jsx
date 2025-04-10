import { Clock, Info, Phone, Wifi, Calendar, Bell } from 'lucide-react'

const InfoPanel = ({ currentTime }) => {
  return (
    <div className="p-4 bg-white">
      <div className="space-y-3">
        <div className="border-b border-blue-100 pb-2">
          <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <Info className="w-4 h-4 mr-1 text-blue-600" />
            እንኳን ደህና መጡ
          </h3>
          <p className="text-xs text-gray-700">እንኳን ወደ ፌዴራል እስር ቤት ኮሚሽን በሰላም መጡ</p>
        </div>

        <div className="border-b border-blue-100 pb-2">
          <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-600" />
            የሕንፃ ሰዓት
          </h3>
          <p className="text-xs text-gray-700">ክፍት 8 ጠዋት – 5 ከሰዓት</p>
        </div>
      </div>
    </div>
  )
}

export default InfoPanel
