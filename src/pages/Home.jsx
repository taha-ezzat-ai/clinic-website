import { clinicData } from "../data/clinic"
import { services } from "../data/services"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-950 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {clinicData.name}
          </h1>
          <p className="text-xl md:text-2xl text-[#b8965a] mb-8 font-light italic">
            {clinicData.doctorTitle}
          </p>
          <Link
            to="/booking"
            className="bg-[#b8965a] hover:bg-[#a1824d] text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 inline-block shadow-lg"
          >
            احجز موعدك الآن
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 gap-8 text-center">
          <div className="p-6">
            <h2 className="text-4xl font-bold text-[#b8965a] mb-2">{clinicData.cases}</h2>
            <p className="text-gray-600 font-medium">حالة ناجحة</p>
          </div>
          <div className="p-6 border-r border-gray-200">
            <h2 className="text-4xl font-bold text-[#b8965a] mb-2">{clinicData.experience}</h2>
            <p className="text-gray-600 font-medium">سنوات خبرة</p>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">أهم خدماتنا</h2>
          <div className="w-20 h-1 bg-[#b8965a] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.slice(0, 4).map((service) => (
            <div key={service.id} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow text-center">
              <span className="text-5xl mb-6 block">{service.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {service.shortDesc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services" className="text-[#b8965a] font-bold hover:underline">
            عرض كل الخدمات ←
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-950 text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 italic">جمالك.. استثمارك الأهم</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          نستخدم أحدث التقنيات لضمان أفضل النتائج الطبيعية بأعلى معايير الأمان.
        </p>
        <a 
          href={`tel:${clinicData.phone}`} 
          className="text-2xl font-bold text-[#b8965a] hover:text-white transition-colors"
        >
          {clinicData.phone}
        </a>
      </section>
    </div>
  )
}
