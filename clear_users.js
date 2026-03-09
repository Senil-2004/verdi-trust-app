import { supabase } from './src/lib/supabase.js';

async function clearUsers() {
    console.log('Clearing users from Supabase...');
    const { data, error } = await supabase.from('users').delete().neq('id', 0);
    if (error) {
        console.error('Failed to parse clear users:', error);
    } else {
        console.log('Cleared all users from Supabase');
    }
}

clearUsers();
