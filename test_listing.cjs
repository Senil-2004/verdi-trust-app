const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim()] = value.join('=').trim();
    return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
    console.log("Testing insert...");
    const { data, error } = await supabase.from('listings').insert([{
        project_source: "Amazon",
        volume: "5000",
        price: "10000",
        type: "Nature",
        vintage: "2024",
        status: 'In Review',
        fill_percentage: 0,
        certificate_file: "test_cert.pdf",
        cover_image: "test_cover.jpg"
    }]);

    if (error) {
        console.error("Insert failed with error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Insert succeeded!", data);
    }
}

testInsert();
