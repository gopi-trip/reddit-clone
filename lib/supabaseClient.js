import { createClient } from '@supabase/supabase-js'

// Check if we're in a browser environment before accessing environment variables
const isBrowser = typeof window !== 'undefined'

// Use a fallback URL structure for development (will still need real values in .env.local)
const supabaseUrl = isBrowser && process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : 'https://your-project-id.supabase.co'

const supabaseKey = isBrowser && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  : 'your-anon-key'

// Create client with error handling
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Simple check to verify connection during development
if (process.env.NODE_ENV !== 'production') {
  // Log connection status only during development
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.warn('Supabase connection issue:', error.message)
    } else {
      console.log('Supabase connection established')
    }
  })
}

export default supabase