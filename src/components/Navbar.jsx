import { useState } from "react"
import { Link } from "react-router-dom"
import { clinicData } from "../data/clinic"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* اللوجو */}
        <Link to="/" className="text-xl font-bold">
          {clinicData.name}
        </Link>

        {/* روابط Desktop */}
        <ul className="hidden md:flex gap-6 text-sm">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/services">الخدمات</Link></li>
          <li><Link to="/results">النتائج</Link></li>
          <li><Link to="/about">عن الدكتور</Link></li>
          <li><Link to="/contact">تواصل معنا</Link></li>
          <li><Link to="/booking" className="bg-primary text-white px-3 py-1 rounded">حجز موعد</Link></li>
        </ul>

        {/* زر الموبايل ☰ */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* قائمة الموبايل */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>الخدمات</Link>
          <Link to="/results" onClick={() => setMenuOpen(false)}>النتائج</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>عن الدكتور</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>تواصل معنا</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)} className="text-primary font-bold">حجز موعد</Link>
        </div>
      )}
    </nav>
  )
}