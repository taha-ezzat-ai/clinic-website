const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './clinic-website/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function update() {
  const sql = `
    -- إضافة عمود visited_at و status لجدول appointments
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS visited_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
    
    -- إضافة عمود review_sent لجدول appointments (للميزة الثانية)
    ALTER TABLE appointments ADD COLUMN IF NOT EXISTS review_sent BOOLEAN DEFAULT FALSE;

    -- إضافة عمود reengagement_sent لجدول patients (للميزة الرابعة)
    ALTER TABLE patients ADD COLUMN IF NOT EXISTS reengagement_sent TIMESTAMP WITH TIME ZONE;
  `;

  // ملاحظة: supabase-js لا يدعم تنفيذ SQL مباشرة بسهولة إلا عبر RPC أو واجهة برمجية معينة.
  // سأفترض وجود دالة exec_sql إذا كانت معدة مسبقاً، أو سأطلب من المستخدم تشغيله في الـ Dashboard.
  console.log("يرجى تشغيل هذا الـ SQL في Supabase Dashboard:");
  console.log(sql);
}

update();
