import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdbmsjbwdmewfqdgdzds.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYm1zamJ3ZG1ld2ZxZGdkemRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1OTY3NDAsImV4cCI6MjA1MzE3Mjc0MH0.O1_QTN6VUJnyE7buv4_cbe721dTkszifOxBbxz3Qnno';

export const supabase = createClient(supabaseUrl, supabaseKey);