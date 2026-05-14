import { clinicData } from "../data/clinic"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">{clinicData.name}</h3>
          <p className="text-gray-400 text-sm">{clinicData.doctorTitle}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">تواصل معنا</h4>
          <a href={`tel:${clinicData.phone}`} className="text-gray-400 text-sm block mb-1">
            📞 {clinicData.phone}
          </a>
          <p className="text-gray-400 text-sm">{clinicData.address}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">مواعيد العمل</h4>
          <p className="text-gray-400 text-sm">{clinicData.workingHours}</p>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-xs">
        جميع الحقوق محفوظة © {new Date().getFullYear()} {clinicData.name}
      </div>
    </footer>
  )
}