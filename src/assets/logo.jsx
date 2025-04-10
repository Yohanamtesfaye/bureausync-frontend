const Logo = () => {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Gold circle border */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#E6C200" strokeWidth="5" />
  
        {/* Blue radial background */}
        <circle cx="100" cy="100" r="90" fill="#0A3D91" />
  
        {/* Radial lines */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180
          const x1 = 100 + 30 * Math.cos(angle)
          const y1 = 100 + 30 * Math.sin(angle)
          const x2 = 100 + 90 * Math.cos(angle)
          const y2 = 100 + 90 * Math.sin(angle)
  
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0A3D91" strokeWidth="4" strokeOpacity="0.6" />
        })}
  
        {/* Shield */}
        <path
          d="M100,40 L140,60 L140,100 C140,130 120,150 100,160 C80,150 60,130 60,100 L60,60 Z"
          fill="#0A3D91"
          stroke="#E6C200"
          strokeWidth="2"
        />
  
        {/* Star */}
        <path d="M100,60 L105,75 L120,75 L110,85 L115,100 L100,90 L85,100 L90,85 L80,75 L95,75 Z" fill="#E6C200" />
  
        {/* Sun rays */}
        <path
          d="M100,100 L110,110 L120,105 L115,115 L125,120 L110,120 L105,130 L100,120 L95,130 L90,120 L75,120 L85,115 L80,105 L90,110 Z"
          fill="#E6C200"
        />
  
        {/* Laurel wreath left */}
        <path d="M60,100 C40,80 50,60 60,50 C55,70 65,90 75,100" fill="none" stroke="#E6C200" strokeWidth="2" />
        <path d="M60,110 C40,90 50,70 60,60 C55,80 65,100 75,110" fill="none" stroke="#E6C200" strokeWidth="2" />
        <path d="M60,120 C40,100 50,80 60,70 C55,90 65,110 75,120" fill="none" stroke="#E6C200" strokeWidth="2" />
  
        {/* Laurel wreath right */}
        <path d="M140,100 C160,80 150,60 140,50 C145,70 135,90 125,100" fill="none" stroke="#E6C200" strokeWidth="2" />
        <path d="M140,110 C160,90 150,70 140,60 C145,80 135,100 125,110" fill="none" stroke="#E6C200" strokeWidth="2" />
        <path d="M140,120 C160,100 150,80 140,70 C145,90 135,110 125,120" fill="none" stroke="#E6C200" strokeWidth="2" />
  
        {/* Bottom text */}
        <text x="100" y="180" textAnchor="middle" fill="#E6C200" fontFamily="Arial" fontWeight="bold" fontSize="14">
          FEDERAL PRISON COMMISSION
        </text>
      </svg>
    )
  }
  
  export default Logo
  