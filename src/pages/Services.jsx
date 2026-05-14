import { services } from "../data/services"
import { clinicData } from "../data/clinic"

export default function Services() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">خدماتنا المتخصصة</h1>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            نقدم مجموعة متكاملة من الخدمات التجميلية باستخدام أحدث الوسائل التكنولوجية في عالم التجميل والليزر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group">
              <div className="p-8">
                <div className="w-16 h-16 bg-[#b8965a]/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.fullDesc}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-sm font-medium text-gray-400 italic">مدة الجلسة: {service.duration}</span>
                  <a href={`https://wa.me/${clinicData.whatsapp}`} className="text-[#b8965a] font-bold text-sm hover:underline">
                    احجز الآن
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
