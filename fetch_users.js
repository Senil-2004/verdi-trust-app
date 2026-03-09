import { supabase } from './src/lib/supabase.js';

async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Users remaining in Supabase:', data);
    }
}

fetchUsers();
