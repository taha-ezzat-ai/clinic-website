import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  try {
    // 1. حساب تاريخ "الأمس"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
    const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

    // 2. جلب المواعيد التي تمت بالأمس ولم يتم إرسال طلب تقييم لها بعد
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        patients (
          name,
          email
        )
      `)
      .eq('status', 'completed')
      .eq('review_sent', false)
      .gte('visited_at', startOfYesterday)
      .lte('visited_at', endOfYesterday);

    if (error) throw error;

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: 'No reviews to request today.' });
    }

    // 3. إرسال إيميلات طلب التقييم
    const emailPromises = appointments.map(async (app: any) => {
      const patient = app.patients;
      if (!patient.email) return;

      const { error: sendError } = await resend.emails.send({
        from: 'Clinic <onboarding@resend.dev>',
        to: patient.email,
        subject: 'رأيك يهمنا ⭐ دقيقة واحدة فقط',
        html: `
          <div dir="rtl" style="font-family: sans-serif; text-align: right; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #b8965a;">مرحباً ${patient.name}،</h2>
            <p>سعدنا جداً بزيارتك لنا بالأمس. في عيادتنا، يهمنا جداً أن نسمع رأيك عن تجربتك معنا، لأن هذا يساعدنا على تقديم الأفضل دائماً.</p>
            <p>هل يمكنك تخصيص دقيقة واحدة فقط لتقييمنا على Google؟</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="GOOGLE_MAPS_LINK" 
                 style="background-color: #b8965a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                اترك تقييمك على Google ⭐
              </a>
            </div>
            <p>شكراً لثقتك بنا،</p>
            <p><strong>فريق عيادة التجميل</strong></p>
          </div>
        `
      });

      if (!sendError) {
        // 4. تحديث حالة إرسال التقييم
        await supabase
          .from('appointments')
          .update({ review_sent: true })
          .eq('id', app.id);
      }
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ success: true, count: appointments.length });
  } catch (err: any) {
    console.error('Review Cron Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
