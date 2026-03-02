import mysql from 'mysql2/promise';

async function run() {
    console.log("Connecting...");
    const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'verdi_trust_db' });
    try {
        const [result] = await pool.query(
            'INSERT INTO listings (project_source, volume, price, type, vintage, status, fill_percentage, certificate_file, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ['Amazon', '5000', '400', 'Nature', '2024', 'In Review', 0, 'dummy.pdf', 'dummy.jpg']
        );
        console.log('Success:', result);
    } catch (err) {
        console.error('MySQL Error:', err);
    }
    process.exit();
}
run();
