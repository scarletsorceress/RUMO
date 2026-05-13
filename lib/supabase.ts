import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Nós vamos preencher essas variáveis logo no próximo passo!
const supabaseUrl = 'https://icsbnsxxsnoydyvqoipt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc2Juc3h4c25veWR5dnFvaXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzM1NzEsImV4cCI6MjA5NDI0OTU3MX0.MLa2cSSNCuZLqM8Pl-fCrDehJsgywxF_MX7NuPVU_6Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});