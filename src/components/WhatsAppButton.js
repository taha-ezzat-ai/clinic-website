import { clinicData } from "../data/clinic"

export default function WhatsAppButton() {
  return (
    
      href={`https://wa.me/${clinicData.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition text-2xl"
    >
      💬
    </a>
  )
}