
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esupbxqznxgcicgbhmyt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzdXBieHF6bnhnY2ljZ2JobXl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU3Mjc2OCwiZXhwIjoyMDU4MTQ4NzY4fQ.TbkQeHZxmpp6CHfS6Ty_VwToBK9UTPwCfUHRHfRHs2k'

export const supabase = createClient(supabaseUrl, supabaseKey)
