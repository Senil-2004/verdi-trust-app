/**
 * Creates the admin Firebase account: admin@gmail.com
 * Run once: node create_admin.cjs
 */

const https = require('https');

const API_KEY = 'AIzaSyAdAvjyDiSDKs3J-z36u7sb6mC-ATXPdAs';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

function post(url, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const urlObj = new URL(url);
        const req = https.request({
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (res) => {
            let raw = '';
            res.on('data', d => raw += d);
            res.on('end', () => resolve(JSON.parse(raw)));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('Creating admin account...');
    const result = await post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: false }
    );

    if (result.error) {
        if (result.error.message === 'EMAIL_EXISTS') {
            console.log('Admin account already exists in Firebase.');
            console.log(`Email    : ${ADMIN_EMAIL}`);
            console.log(`Password : ${ADMIN_PASSWORD}`);
        } else {
            console.error('Error:', result.error.message);
        }
        return;
    }

    console.log('Admin account created successfully!');
    console.log(`Email    : ${ADMIN_EMAIL}`);
    console.log(`Password : ${ADMIN_PASSWORD}`);
    console.log('UID      :', result.localId);
}

main();
