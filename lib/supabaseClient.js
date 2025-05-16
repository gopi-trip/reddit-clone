import { createClient } from '@supabase/supabase-js'

// Check if required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Make sure you have set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Log connection status during development
if (process.env.NODE_ENV !== 'production') {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.warn('Supabase connection issue:', error.message)
    } else {
      console.log('Supabase connection established')
    }
  })
}

export default supabase