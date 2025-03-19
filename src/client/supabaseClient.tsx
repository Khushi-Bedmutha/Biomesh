import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emwtwnemctqiimjypetc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtd3R3bmVtY3RxaWltanlwZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTAwNTUsImV4cCI6MjA1Nzg4NjA1NX0.R2tYkKMk2GmQesQml41sBIxGT08e09xvo9k7YMTjNuA'
export const supabase = createClient(supabaseUrl, supabaseKey)