import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './clinic-website/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupTestData() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(12, 0, 0, 0);

  const { data: patients } = await supabase.from('patients').select('id').limit(1);
  if (!patients || patients.length === 0) return;
  const patientId = patients[0].id;

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        patient_id: patientId,
        appointment_date: new Date().toISOString(),
        visited_at: yesterday.toISOString(),
        status: 'completed',
        review_sent: false,
        notes: 'Test for feature 2'
      }
    ])
    .select();

  if (error) console.error(error);
  else console.log("تم إنشاء موعد تجريبي لطلب التقييم بنجاح:", data);
}

setupTestData();
