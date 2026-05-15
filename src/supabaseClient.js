import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cnqxxtdizvozmkzxiera.supabase.co'
const supabaseKey = 'sb_publishable_4uS7NbnTRCxL7LZgV5ywog__19LlzhJ'

export const supabase = createClient(supabaseUrl, supabaseKey)
