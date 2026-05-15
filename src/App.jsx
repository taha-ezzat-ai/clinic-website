import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"
import ChatBot from "./components/ChatBot"
import Home from "./pages/Home"
import Services from "./pages/Services"
import Results from "./pages/Results"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Booking from "./pages/Booking"
import "./index.css"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
    </BrowserRouter>
  )
}