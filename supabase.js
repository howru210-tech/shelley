import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// TODO: 본인의 Supabase 프로젝트 설정에서 URL과 anon key를 복사하여 아래에 붙여넣으세요!
const supabaseUrl = 'https://zpxdtuadircqrrxmfbvq.supabase.co';
const supabaseAnonKey = 'sb_publishable_Aqwzup3EF0fr2-7dYHSkvw_l8QVEvn2';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
