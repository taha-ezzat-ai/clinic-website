import { clinicData } from "../data/clinic"

export default function About() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        {/* Doctor Image */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-[#b8965a] rounded-3xl -z-10"></div>
            <img 
              src="https://placehold.co/600x800/1a1a1a/b8965a?text=Doctor+Photo" 
              alt={clinicData.doctorName}
              className="w-full rounded-3xl shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* Doctor Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{clinicData.doctorName}</h1>
          <p className="text-xl text-[#b8965a] font-medium mb-8 italic">{clinicData.doctorTitle}</p>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              بخبرة تزيد عن <span className="text-gray-900 font-bold">{clinicData.experience} عاماً</span> في مجال جراحة التجميل، نؤمن بأن كل حالة هي لوحة فنية فريدة تتطلب رؤية جمالية وخبرة طبية دقيقة.
            </p>
            <p>
              تخرج الدكتور من أرقى الجامعات وحصل على زمالات دولية متعددة في تقنيات الليزر المتقدم وحقن الفيلر والبوتكس، مما يجعلنا في طليعة مراكز التجميل التي تقدم خدمات آمنة ونتائج مبهرة.
            </p>
            
            <div className="pt-8 grid grid-cols-2 gap-4">
              <div className="border-r-4 border-[#b8965a] pr-4 py-2">
                <h4 className="font-bold text-gray-900">شهادات دولية</h4>
                <p className="text-xs">معتمدة من الجمعية العالمية للتجميل</p>
              </div>
              <div className="border-r-4 border-[#b8965a] pr-4 py-2">
                <h4 className="font-bold text-gray-900">تقنيات حديثة</h4>
                <p className="text-xs">أحدث أجهزة الليزر العالمية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
