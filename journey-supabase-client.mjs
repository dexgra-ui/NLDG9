// Public publishable key only. Never use a service-role key in browser code.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.58.0/+esm';
export const journeyClient = createClient(
  'https://hdzogotikjhrowkepvye.supabase.co',
  'sb_publishable_TIvG9nP0LY8jDOgwhGemrA_nZoPgRNL',
  {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit'}}
);
