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
    // 1. حساب تاريخ "منذ 30 يوم"
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startOfDate = new Date(thirtyDaysAgo.setHours(0, 0, 0, 0)).toISOString();
    const endOfDate = new Date(thirtyDaysAgo.setHours(23, 59, 59, 999)).toISOString();

    // 2. جلب المرضى الذين كان آخر موعد لهم بالضبط منذ 30 يوماً ولم يرسل لهم Re-engagement
    // نستخدم Query ذكي لجلب المرضى الذين تنطبق عليهم الشروط
    const { data: patients, error } = await supabase
      .from('patients')
      .select(`
        id,
        name,
        email,
        appointments (
          appointment_date
        )
      `)
      .is('reengagement_sent', null);

    if (error) throw error;

    const targetedPatients = patients.filter((p: any) => {
      // التأكد من أن آخر موعد كان منذ 30 يوماً بالضبط
      const lastApp = p.appointments.sort((a: any, b: any) => 
        new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
      )[0];

      if (!lastApp) return false;

      const appDate = new Date(lastApp.appointment_date).toISOString();
      return appDate >= startOfDate && appDate <= endOfDate;
    });

    if (targetedPatients.length === 0) {
      return res.status(200).json({ message: 'No re-engagements needed today.' });
    }

    // 3. إرسال إيميلات الاستعادة
    const emailPromises = targetedPatients.map(async (patient: any) => {
      if (!patient.email) return;

      const { error: sendError } = await resend.emails.send({
        from: 'Clinic <onboarding@resend.dev>',
        to: patient.email,
        subject: 'اشتقنالك! 💛 فيه عرض خاص ليك',
        html: `
          <div dir="rtl" style="font-family: sans-serif; text-align: right; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #b8965a;">مرحباً ${patient.name}،</h2>
            <p>بقاله فترة كبيرة ما نورناش في العيادة، واشتقنا نشوفك جداً!</p>
            <p>عشان كدة، عملنا لك عرض خاص وخصم حصري على زيارتك الجاية كنوع من التقدير لثقتك فينا.</p>
            <p>تقدر تحجز موعدك الجاي دلوقتي وتستفيد من العرض:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://clinic-website-mauve.vercel.app/booking" 
                 style="background-color: #b8965a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                احجز موعدك واستفيد بالخصم 💛
              </a>
            </div>
            <p>مستنيين نشوفك قريب،</p>
            <p><strong>فريق عيادة التجميل</strong></p>
          </div>
        `
      });

      if (!sendError) {
        // 4. تحديث تاريخ إرسال الاستعادة
        await supabase
          .from('patients')
          .update({ reengagement_sent: new Date().toISOString() })
          .eq('id', patient.id);
      }
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ success: true, count: targetedPatients.length });
  } catch (err: any) {
    console.error('Re-engagement Cron Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
