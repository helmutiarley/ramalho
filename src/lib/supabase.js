
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase env vars ausentes. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.'
  )
}

try {
  const payload = JSON.parse(atob(supabaseKey.split('.')[1]))

  if (payload.role === 'service_role') {
    throw new Error(
      'Nao use a service_role no frontend. Troque VITE_SUPABASE_ANON_KEY pela anon key publica do Supabase.'
    )
  }
} catch (error) {
  if (error instanceof SyntaxError) {
    throw new Error('VITE_SUPABASE_ANON_KEY esta em um formato invalido.')
  }

  if (error instanceof Error) {
    throw error
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey)
