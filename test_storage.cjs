const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim()] = value.join('=').trim();
    return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testStorage() {
    console.log("Testing storage and notification insert...");
    
    // Test Notifications
    const { error: notifErr } = await supabase.from('notifications').insert([{
        title: 'New Verification Required',
        message: 'Test message'
    }]);

    if (notifErr) {
        console.error("Notification Insert failed:", notifErr);
    } else {
        console.log("Notification Insert succeeded!");
    }

    // Test Storage
    const fakeFile = Buffer.from('Testing 123');
    const { error: storageErr } = await supabase.storage.from('uploads').upload(`test/test-${Date.now()}.txt`, fakeFile, {
        contentType: 'text/plain',
        upsert: true
    });

    if (storageErr) {
        console.error("Storage Insert failed:", storageErr);
    } else {
        console.log("Storage Insert succeeded!");
    }
}

testStorage();
