/**
 * Sync admin user into Supabase users table
 * Run: node sync_admin_supabase.cjs
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://xrtxrajdbfrjvajedyqo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydHhyYWpkYmZyanZhamVkeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mjg2NjYsImV4cCI6MjA4ODEwNDY2Nn0.r19T9Py-6fGTGb2QHW5XlyPYoIbFthasOaShFKOv29c'
);

async function main() {
    const { error } = await supabase.from('users').upsert([{
        name: 'Platform Admin',
        email: 'admin@gmail.com',
        role: 'Admin',
        status: 'Active'
    }], { onConflict: 'email' });

    if (error) {
        console.error('Supabase error:', error.message);
    } else {
        console.log('✅ Admin synced to Supabase successfully!');
    }
}

main();
