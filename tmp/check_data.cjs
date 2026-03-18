const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrtxrajdbfrjvajedyqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydHhyYWpkYmZyanZhamVkeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mjg2NjYsImV4cCI6MjA4ODEwNDY2Nn0.r19T9Py-6fGTGb2QHW5XlyPYoIbFthasOaShFKOv29c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    try {
        const { data: projects } = await supabase.from('projects').select('*');
        const { data: listings } = await supabase.from('listings').select('*');
        
        console.log('--- Projects ---');
        console.log(JSON.stringify(projects?.map(p => ({ id: p.id, name: p.name || p.project_source, status: p.status })), null, 2));
        
        console.log('--- Listings ---');
        console.log(JSON.stringify(listings?.map(l => ({ id: l.id, name: l.project_source, status: l.status })), null, 2));
    } catch (err) {
        console.error(err);
    }
}

checkData();
