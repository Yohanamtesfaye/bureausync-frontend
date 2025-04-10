import { useState } from "react"

const Directory = ({ bureaus }) => {
  const [activeFloor, setActiveFloor] = useState(null)

  // Group bureaus by floor
  const groupedBureaus = bureaus.reduce((acc, bureau) => {
    const floor = bureau.floor
    if (!acc[floor]) {
      acc[floor] = []
    }
    acc[floor].push(bureau)
    return acc
  }, {})

  const floors = Object.keys(groupedBureaus).sort()

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-blue-800 text-center border-b border-blue-100 pb-2">
        የቢሮ ዝርዝር
      </h2>

      <div className="flex justify-center mb-4 space-x-2">
        {floors.map((floor) => (
          <button
            key={floor}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              activeFloor === parseInt(floor)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => setActiveFloor(activeFloor === parseInt(floor) ? null : parseInt(floor))}
          >
            {floor}
          </button>
        ))}
      </div>

      {(activeFloor ? [activeFloor.toString()] : floors).map((floor) => (
        <div key={floor} className="mb-4 animate-fadeIn">
          <h3 className="text-md font-bold mb-2 text-blue-800 bg-blue-50 px-3 py-1 rounded-md flex items-center">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
              {floor}
            </span>
             {floor}ኛ ፎቅ
          </h3>

          <div className="space-y-2">
            {groupedBureaus[floor].map((bureau) => (
              <div
                key={bureau.id}
                className="p-3 rounded-md bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all hover:border-blue-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-blue-800">ቢሮ ቁጥር {bureau.room}</p>
                    <p className="text-gray-700">{bureau.name}</p>
                    {bureau.description && <p className="text-xs text-gray-500">{bureau.description}</p>}
                  </div>
                  <div className="bg-blue-50 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {bureau.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Directory
