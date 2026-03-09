import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xrtxrajdbfrjvajedyqo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydHhyYWpkYmZyanZhamVkeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mjg2NjYsImV4cCI6MjA4ODEwNDY2Nn0.r19T9Py-6fGTGb2QHW5XlyPYoIbFthasOaShFKOv29c'
export const supabase = createClient(supabaseUrl, supabaseKey)
