/**
 * Creates the buyer Firebase account: senilcyriac@gmail.com
 * Run once: node create_buyer.cjs
 */

const https = require('https');

const API_KEY = 'AIzaSyAdAvjyDiSDKs3J-z36u7sb6mC-ATXPdAs';
const BUYER_EMAIL = 'senilcyriac@gmail.com';
const BUYER_PASSWORD = 'senil@2004';

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
    console.log('Creating buyer account...');
    const result = await post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        { email: BUYER_EMAIL, password: BUYER_PASSWORD, returnSecureToken: false }
    );

    if (result.error) {
        if (result.error.message === 'EMAIL_EXISTS') {
            console.log('Buyer account already exists in Firebase.');
        } else {
            console.error('Error:', result.error.message);
        }
        return;
    }

    console.log('Buyer account created successfully!');
    console.log(`Email    : ${BUYER_EMAIL}`);
    console.log(`Password : ${BUYER_PASSWORD}`);
}

main();
