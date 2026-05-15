import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// إعداد العملاء (تأكد من إضافة المتغيرات في Vercel Dashboard)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // نستخدم Service Role لتخطي RLS في الـ Cron
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  // التحقق من أن الطلب آتٍ من Vercel Cron (اختياري للأمان)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  try {
    // 1. حساب تاريخ "غداً"
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();

    // 2. جلب المواعيد من Supabase مع بيانات المريض
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        appointment_date,
        patients (
          name,
          email
        )
      `)
      .gte('appointment_date', startOfTomorrow)
      .lte('appointment_date', endOfTomorrow);

    if (error) throw error;

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: 'No appointments for tomorrow.' });
    }

    // 3. إرسال الإيميلات
    const emailPromises = appointments.map(async (app: any) => {
      const patient = app.patients;
      if (!patient.email) return;

      const dateStr = new Date(app.appointment_date).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return resend.emails.send({
        from: 'Clinic <onboarding@resend.dev>', // غير هذا لإيميلك الموثق لاحقاً
        to: patient.email,
        subject: 'تذكير بموعدك في العيادة 🏥',
        html: `
          <div dir="rtl" style="font-family: sans-serif; text-align: right;">
            <h2>مرحباً ${patient.name}،</h2>
            <p>نود تذكيرك بموعدك المحجوز في عيادتنا غداً إن شاء الله.</p>
            <p><strong>تفاصيل الموعد:</strong></p>
            <ul>
              <li>التاريخ: ${dateStr}</li>
            </ul>
            <p>نتمنى لك دوام الصحة والعافية.</p>
            <hr />
            <p style="font-size: 12px; color: #666;">إذا أردت تعديل أو إلغاء الموعد، يرجى التواصل معنا في أقرب وقت.</p>
          </div>
        `
      });
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ success: true, count: appointments.length });
  } catch (err: any) {
    console.error('Cron Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
