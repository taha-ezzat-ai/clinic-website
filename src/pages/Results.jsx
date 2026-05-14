export default function Results() {
  const samples = [1, 2, 3, 4]
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">نتائج نفتخر بها</h1>
          <p className="text-gray-500 mb-2">أمثلة لبعض الحالات قبل وبعد الإجراء</p>
          <div className="w-16 h-1 bg-[#b8965a] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {samples.map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100">
              <div className="flex flex-col sm:flex-row h-64 md:h-80">
                {/* Before */}
                <div className="relative flex-1 bg-gray-200">
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 text-xs rounded-full backdrop-blur-sm">قبل</div>
                  <img 
                    src={`https://placehold.co/400x600/1a1a1a/b8965a?text=Before+Sample+${i}`} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* After */}
                <div className="relative flex-1 bg-gray-300">
                  <div className="absolute top-4 left-4 bg-[#b8965a] text-white px-3 py-1 text-xs rounded-full shadow-lg">بعد</div>
                  <img 
                    src={`https://placehold.co/400x600/2a2a2a/ffffff?text=After+Sample+${i}`} 
                    alt="After" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <h3 className="font-bold text-gray-800">حالة علاجية رقم {i}</h3>
                <p className="text-sm text-gray-500">تم الإجراء في عيادتنا باستخدام أحدث التقنيات</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
