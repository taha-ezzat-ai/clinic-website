import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    appointment_date: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // 1. Check if patient exists or create new one
      let { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('email', formData.email)
        .single()

      let patientId

      if (patientError && patientError.code === 'PGRST116') {
        // Patient doesn't exist, create one
        const { data: newPatient, error: createError } = await supabase
          .from('patients')
          .insert([
            { name: formData.name, phone: formData.phone, email: formData.email }
          ])
          .select()
          .single()

        if (createError) throw createError
        patientId = newPatient.id
      } else if (patientError) {
        throw patientError
      } else {
        patientId = patient.id
      }

      // 2. Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: patientId,
            appointment_date: formData.appointment_date,
            notes: formData.notes
          }
        ])

      if (appointmentError) throw appointmentError

      setMessage('تم حجز الموعد بنجاح! سنتواصل معك قريباً. ✅')
      setFormData({
        name: '',
        phone: '',
        email: '',
        appointment_date: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error booking appointment:', error)
      setMessage('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى. ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">حجز موعد جديد</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md text-center ${message.includes('بنجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">اسم المريض</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
            placeholder="الاسم بالكامل"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">رقم التليفون</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
              placeholder="01xxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">الإيميل</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
              placeholder="example@mail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">تاريخ الموعد</label>
          <input
            type="datetime-local"
            name="appointment_date"
            required
            value={formData.appointment_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border"
            placeholder="أي تفاصيل إضافية..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-all disabled:bg-gray-400"
        >
          {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
        </button>
      </form>
    </div>
  )
}
