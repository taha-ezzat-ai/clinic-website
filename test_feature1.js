import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './clinic-website/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupTestData() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(12, 0, 0, 0); // في منتصف اليوم لضمان الوقوع في النطاق

  // 1. جلب أول مريض موجود
  const { data: patients } = await supabase.from('patients').select('id').limit(1);
  if (!patients || patients.length === 0) {
    console.log("لا يوجد مرضى في القاعدة. يرجى حجز موعد أولاً.");
    return;
  }
  const patientId = patients[0].id;

  // 2. إنشاء موعد منتهي منذ 3 أيام
  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        patient_id: patientId,
        appointment_date: new Date().toISOString(),
        visited_at: threeDaysAgo.toISOString(),
        status: 'completed',
        notes: 'Test for feature 1'
      }
    ])
    .select();

  if (error) {
    console.error("خطأ في إنشاء بيانات الاختبار:", error);
  } else {
    console.log("تم إنشاء موعد تجريبي للمتابعة بنجاح:", data);
  }
}

setupTestData();
