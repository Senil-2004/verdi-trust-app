import { supabase } from './src/lib/supabase.js';

async function seed() {
    console.log('🌱 Seeding Supabase with production-grade data...\n');

    // ─── CLEAR EXISTING DATA ─────────────────────────────────────
    await supabase.from('notifications').delete().neq('id', 0);
    await supabase.from('transactions').delete().neq('id', 0);
    await supabase.from('listings').delete().neq('id', 0);
    await supabase.from('projects').delete().neq('id', 0);
    await supabase.from('users').delete().neq('id', 0);
    console.log('✓ Cleared old data');

    // ─── LISTINGS (12 diverse carbon credit offerings) ───────────
    const { error: listingsErr } = await supabase.from('listings').insert([
        { project_source: 'Amazon Reforestation Initiative', volume: 42000, price: 22.50, status: 'Active', fill_percentage: 84, type: 'Nature', vintage: 2024 },
        { project_source: 'Wind Farm Indonesia', volume: 120000, price: 18.00, status: 'Active', fill_percentage: 62, type: 'Energy', vintage: 2023 },
        { project_source: 'Solar Park Rajasthan', volume: 8500, price: 25.00, status: 'Sold Out', fill_percentage: 100, type: 'Energy', vintage: 2024 },
        { project_source: 'Methane Capture Texas', volume: 35000, price: 24.00, status: 'Active', fill_percentage: 45, type: 'Technology', vintage: 2023 },
        { project_source: 'Boreal Forest Conservation', volume: 67000, price: 19.75, status: 'Active', fill_percentage: 71, type: 'Nature', vintage: 2024 },
        { project_source: 'Offshore Wind Netherlands', volume: 95000, price: 21.00, status: 'Active', fill_percentage: 38, type: 'Energy', vintage: 2024 },
        { project_source: 'Mangrove Restoration Vietnam', volume: 28000, price: 27.50, status: 'Active', fill_percentage: 55, type: 'Nature', vintage: 2023 },
        { project_source: 'Geothermal Plant Iceland', volume: 15000, price: 32.00, status: 'Active', fill_percentage: 90, type: 'Energy', vintage: 2024 },
        { project_source: 'Biochar Sequestration Kenya', volume: 22000, price: 29.00, status: 'In Review', fill_percentage: 0, type: 'Technology', vintage: 2025 },
        { project_source: 'Tidal Energy Scotland', volume: 18000, price: 35.00, status: 'In Review', fill_percentage: 0, type: 'Energy', vintage: 2025 },
        { project_source: 'Peatland Rewetting Germany', volume: 31000, price: 23.50, status: 'Active', fill_percentage: 67, type: 'Nature', vintage: 2024 },
        { project_source: 'Direct Air Capture Switzerland', volume: 5000, price: 145.00, status: 'Active', fill_percentage: 92, type: 'Technology', vintage: 2025 },
    ]);
    if (listingsErr) console.error('Listings error:', listingsErr);
    else console.log('✓ 12 Listings seeded');

    // ─── TRANSACTIONS (25 realistic transactions spread across months) ───
    const now = new Date();
    const txData = [
        { buyer_name: 'Microsoft Corp', credits: 12000, amount: 270000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 15).toISOString() },
        { buyer_name: 'Apple Inc', credits: 8500, amount: 191250.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 22).toISOString() },
        { buyer_name: 'Delta Airlines', credits: 15000, amount: 270000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 3).toISOString() },
        { buyer_name: 'Stripe Climate', credits: 4500, amount: 101250.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 14).toISOString() },
        { buyer_name: 'BMW Group', credits: 22000, amount: 495000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 28).toISOString() },
        { buyer_name: 'Google LLC', credits: 35000, amount: 787500.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 1).toISOString() },
        { buyer_name: 'Shell Energy', credits: 9200, amount: 207000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 5).toISOString() },
        { buyer_name: 'Unilever PLC', credits: 6800, amount: 153000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 10).toISOString() },
        { buyer_name: 'JPMorgan Chase', credits: 18000, amount: 405000.00, status: 'Processing', transaction_date: new Date(now.getFullYear(), 2, 15).toISOString() },
        { buyer_name: 'Salesforce Inc', credits: 5500, amount: 123750.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 20).toISOString() },
        { buyer_name: 'Amazon Web Services', credits: 28000, amount: 630000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 25).toISOString() },
        { buyer_name: 'Tata Group', credits: 7500, amount: 168750.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 5).toISOString() },
        { buyer_name: 'Reliance Industries', credits: 14000, amount: 315000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 28).toISOString() },
        { buyer_name: 'Infosys Ltd', credits: 3200, amount: 72000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 8).toISOString() },
        { buyer_name: 'HDFC Bank', credits: 6000, amount: 135000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 19).toISOString() },
        { buyer_name: 'Nestle SA', credits: 11000, amount: 247500.00, status: 'Processing', transaction_date: new Date(now.getFullYear(), 2, 2).toISOString() },
        { buyer_name: 'Toyota Motor Corp', credits: 9800, amount: 220500.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 18).toISOString() },
        { buyer_name: 'Samsung Electronics', credits: 16500, amount: 371250.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 12).toISOString() },
        { buyer_name: 'Adani Green Energy', credits: 25000, amount: 562500.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 8).toISOString() },
        { buyer_name: 'IKEA Group', credits: 4200, amount: 94500.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 10).toISOString() },
        { buyer_name: 'Meta Platforms', credits: 19000, amount: 427500.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 1, 25).toISOString() },
        { buyer_name: 'Mahindra & Mahindra', credits: 7800, amount: 175500.00, status: 'Processing', transaction_date: new Date(now.getFullYear(), 2, 12).toISOString() },
        { buyer_name: 'British Airways', credits: 13500, amount: 303750.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 18).toISOString() },
        { buyer_name: 'Vodafone Group', credits: 5100, amount: 114750.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 0, 30).toISOString() },
        { buyer_name: 'Wipro Ltd', credits: 2800, amount: 63000.00, status: 'Completed', transaction_date: new Date(now.getFullYear(), 2, 28).toISOString() },
    ];
    const { error: txErr } = await supabase.from('transactions').insert(txData);
    if (txErr) console.error('Transactions error:', txErr);
    else console.log('✓ 25 Transactions seeded');

    // ─── USERS (10 realistic platform users) ─────────────────────
    const { error: usersErr } = await supabase.from('users').insert([
        { name: 'Aarav Mehta', email: 'aarav@verditrust.com', role: 'Platform Admin', status: 'Active' },
        { name: 'Sarah Chen', email: 'sarah.chen@greenearth.co', role: 'Project Developer', status: 'Active' },
        { name: 'Marcus Blake', email: 'marcus@climatefund.io', role: 'Credit Buyer', status: 'Active' },
        { name: 'Priya Sharma', email: 'priya@carbontrade.in', role: 'Credit Seller', status: 'Active' },
        { name: 'James O\'Brien', email: 'james@windpower.eu', role: 'Project Developer', status: 'Active' },
        { name: 'Anika Patel', email: 'anika@verditrust.com', role: 'Admin', status: 'Active' },
        { name: 'Chen Wei', email: 'chen.wei@asiapacific.energy', role: 'Credit Buyer', status: 'Active' },
        { name: 'Isabella Rodriguez', email: 'isabella@forestguard.org', role: 'Project Developer', status: 'Pending' },
        { name: 'David Kim', email: 'david.kim@solarventures.kr', role: 'Credit Seller', status: 'Active' },
        { name: 'Fatima Al-Hassan', email: 'fatima@menacarbon.ae', role: 'Credit Buyer', status: 'Active' },
    ]);
    if (usersErr) console.error('Users error:', usersErr);
    else console.log('✓ 10 Users seeded');

    // ─── PROJECTS (8 diverse projects with various statuses) ─────
    const { error: projErr } = await supabase.from('projects').insert([
        { name: 'Amazon Rainforest Reforestation', region: 'Brazil', status: 'Approved', developer: 'GreenEarth Co' },
        { name: 'Solar Array V-42', region: 'Germany', status: 'Approved', developer: 'SunPower Ltd' },
        { name: 'Coastal Mangrove Protection', region: 'Vietnam', status: 'In Review', developer: 'OceanWatch' },
        { name: 'Industrial Carbon Capture', region: 'USA', status: 'Rejected', developer: 'TechCarbon' },
        { name: 'Himalayan Glacier Preservation', region: 'India', status: 'Pending', developer: 'MountainGuard Foundation' },
        { name: 'Saharan Solar Mega-Farm', region: 'Morocco', status: 'Approved', developer: 'DesertSun Energy' },
        { name: 'Baltic Offshore Wind Corridor', region: 'Denmark', status: 'In Review', developer: 'NordWind AS' },
        { name: 'Congo Basin Forest Conservation', region: 'DRC', status: 'Pending', developer: 'AfricaGreen Initiative' },
    ]);
    if (projErr) console.error('Projects error:', projErr);
    else console.log('✓ 8 Projects seeded');

    // ─── NOTIFICATIONS (8 realistic notifications) ───────────────
    const { error: notifErr } = await supabase.from('notifications').insert([
        { title: 'New Verification Required', message: 'Biochar Sequestration Kenya requires protocol authorization.', is_read: false },
        { title: 'Settlement Processed', message: 'Transaction #TX-2847 with Google LLC cleared successfully. ₹7,87,500 deposited.', is_read: false },
        { title: 'Market Alert', message: 'Carbon credit prices surged 12% in EU ETS. Consider adjusting your listings.', is_read: false },
        { title: 'New Buyer Registered', message: 'JPMorgan Chase has joined the marketplace as an institutional buyer.', is_read: true },
        { title: 'Listing Approved', message: 'Your "Direct Air Capture Switzerland" offering has been verified and is now live.', is_read: true },
        { title: 'Quarterly Report Available', message: 'Q1 2026 market intelligence report is ready for download.', is_read: true },
        { title: 'Compliance Update', message: 'New SEBI carbon credit trading regulations take effect March 15, 2026.', is_read: false },
        { title: 'Welcome to VerdiTrust', message: 'Your institutional carbon credit marketplace account is fully configured.', is_read: true },
    ]);
    if (notifErr) console.error('Notifications error:', notifErr);
    else console.log('✓ 8 Notifications seeded');

    console.log('\n🚀 Seeding complete! Your Supabase database is now production-ready.');
}

seed().catch(console.error);
