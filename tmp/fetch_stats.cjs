const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrtxrajdbfrjvajedyqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydHhyYWpkYmZyanZhamVkeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mjg2NjYsImV4cCI6MjA4ODEwNDY2Nn0.r19T9Py-6fGTGb2QHW5XlyPYoIbFthasOaShFKOv29c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchStats() {
    try {
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { data: listings } = await supabase.from('listings').select('volume, status');
        const { data: transactions } = await supabase.from('transactions').select('amount');

        const activeProjects = listings ? listings.filter(l => l.status === 'Active').length : 0;
        const totalRevenue = transactions ? transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) : 0;

        console.log('--- Real Database Stats ---');
        console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
        console.log(`Active Projects: ${activeProjects}`);
        console.log(`Total Users: ${usersCount}`);
        console.log('---------------------------');
    } catch (err) {
        console.error(err);
    }
}

fetchStats();
