const Header = () => {
  return (
    <header className="bg-white border-b-2 border-blue-200 py-3 px-4 flex items-center">
      <div className="flex items-center">
        <img src="/logo.png" alt="Federal Prison Commission Logo" className="w-12 h-12 mr-4" />
        <div>
          <h1 className="text-xl font-bold text-blue-800">ፌደራል ማረሚያ ቤት ኮሚሽን የቢሮ ማረሚያ ማዕከል</h1>
          <p className="text-sm text-blue-600">አንድነት አወጣኝ, እንደን በር ተቀጣጥን በሰላም መኖር</p>
        </div>
      </div>
      <div className="ml-auto text-right">
        <div className="text-xl font-bold text-blue-800">10:58 PM</div>
        <div className="text-sm text-blue-600">Tuesday, May 6, 2025</div>
      </div>
    </header>
  )
}

export default Header
