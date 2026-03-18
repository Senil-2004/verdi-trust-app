const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim()] = value.join('=').trim();
    return acc;
}, {});

const firebaseApiKey = env.VITE_FIREBASE_API_KEY;
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

async function createDev() {
    const email = "project@gmail.com";
    const password = "project123";
    let uid = "manual_dev_123";

    try {
        console.log("Creating Firebase user...");
        const fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true })
        });
        const fbData = await fbRes.json();
        
        if (fbData.error && fbData.error.message !== 'EMAIL_EXISTS') {
            throw new Error(`Firebase Auth Error: ${fbData.error.message}`);
        } else if (fbData.localId) {
            uid = fbData.localId;
            console.log("Firebase user created with UID:", uid);
        } else if (fbData.error && fbData.error.message === 'EMAIL_EXISTS') {
            console.log("Firebase user already exists. We will upsert Supabase role anyway.");
        }
        
        console.log("Upserting Supabase user role...");
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/users`, {
            method: 'POST',
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                name: "Project Director",
                email: email,
                role: "Project Developer",
                status: "Active"
            })
        });
        
        if (!sbRes.ok) {
            const err = await sbRes.text();
            throw new Error(`Supabase Error: ${err}`);
        }
        
        console.log("Successfully prepared project developer credentials!");
        
    } catch (e) {
        console.error("Script failed:", e);
    }
}

createDev();
