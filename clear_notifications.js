import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://xrtxrajdbfrjvajedyqo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhydHhyYWpkYmZyanZhamVkeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mjg2NjYsImV4cCI6MjA4ODEwNDY2Nn0.r19T9Py-6fGTGb2QHW5XlyPYoIbFthasOaShFKOv29c'
);

async function clearNotifications() {
    console.log('Clearing all old notifications...');
    const { error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', 0); // delete all rows

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('✅ All notifications cleared. Only real site events will appear from now on.');
    }
}

clearNotifications();
