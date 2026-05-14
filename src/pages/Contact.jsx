import { clinicData } from "../data/clinic"

export default function Contact() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
          <p className="text-gray-500">نحن هنا للإجابة على جميع استفساراتك وحجز موعدك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info & Links */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center text-white text-xl">📞</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">اتصل بنا مباشرة</h3>
                <p className="text-gray-500 mb-4 text-sm">متاحون للرد خلال مواعيد العمل</p>
                <a href={`tel:${clinicData.phone}`} className="text-2xl font-bold text-[#b8965a] hover:underline tabular-nums">
                  {clinicData.phone}
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white text-xl">💬</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">واتساب</h3>
                <p className="text-gray-500 mb-4 text-sm">للاستفسارات السريعة وحجز المواعيد</p>
                <a href={`https://wa.me/${clinicData.whatsapp}`} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-colors inline-block text-sm">
                  مراسلة الآن
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="w-12 h-12 bg-[#b8965a] rounded-2xl flex items-center justify-center text-white text-xl">📍</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">موقع العيادة</h3>
                <p className="text-gray-700 mt-2">{clinicData.address}</p>
                <p className="text-sm text-gray-400 mt-2 italic">{clinicData.workingHours}</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="h-full min-h-[400px] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-200 shadow-inner">
            <img 
              src="https://placehold.co/800x800/f3f4f6/b8965a?text=Google+Map+Placeholder" 
              alt="Map"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center">
                <span className="text-3xl mb-2 block">📍</span>
                <p className="font-bold text-gray-800">خريطة العيادة ستظهر هنا</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
