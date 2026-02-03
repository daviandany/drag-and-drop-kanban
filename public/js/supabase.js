import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


const supabaseUrl = 'https://izyrbosdmlxqobqwunpn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXJib3NkbWx4cW9icXd1bnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzIyMjYsImV4cCI6MjA4NTQ0ODIyNn0._LrajI_OxnVpZnjkNjMTZKr0Ka41M9MG-znMc7XuZYM';

export const supabase = createClient(supabaseUrl, supabaseKey);
