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
    // 1. حساب تاريخ "منذ 3 أيام"
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const startOfDate = new Date(threeDaysAgo.setHours(0, 0, 0, 0)).toISOString();
    const endOfDate = new Date(threeDaysAgo.setHours(23, 59, 59, 999)).toISOString();

    // 2. جلب المواعيد المنتهية منذ 3 أيام
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
      .gte('visited_at', startOfDate)
      .lte('visited_at', endOfDate);

    if (error) throw error;

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ message: 'No follow-ups for today.' });
    }

    // 3. إرسال إيميلات المتابعة
    const emailPromises = appointments.map(async (app: any) => {
      const patient = app.patients;
      if (!patient.email) return;

      return resend.emails.send({
        from: 'Clinic <onboarding@resend.dev>',
        to: patient.email,
        subject: 'كيف حالك بعد زيارتك؟ 💙',
        html: `
          <div dir="rtl" style="font-family: sans-serif; text-align: right; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #b8965a;">مرحباً ${patient.name}،</h2>
            <p>بنطمن عليك بعد 3 أيام من زيارتك للعيادة. يا رب تكون النتيجة نالت إعجابك وتكون في أحسن حال.</p>
            <p>لو عندك أي استفسار أو محتاج استشارة بخصوص أي حاجة بعد الإجراء، فريقنا موجود دايماً لمساعدتك.</p>
            <p>ممكن تحجز استشارة متابعة في أي وقت من هنا:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://clinic-website-mauve.vercel.app/booking" 
                 style="background-color: #b8965a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                حجز موعد متابعة
              </a>
            </div>
            <p>نتمنى لك دوام الجمال والصحة،</p>
            <p><strong>فريق عيادة التجميل</strong></p>
          </div>
        `
      });
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ success: true, count: appointments.length });
  } catch (err: any) {
    console.error('Follow-up Cron Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
