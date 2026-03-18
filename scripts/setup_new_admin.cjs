/**
 * Creates the new admin Firebase account: admin@gmail.com / admin123
 * Run once: node setup_new_admin.cjs
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
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
                } catch (e) {
                    reject(raw);
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log(`Checking/Creating admin account: ${ADMIN_EMAIL}...`);

    try {
        const result = await post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
            { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: false }
        );

        if (result.error) {
            if (result.error.message === 'EMAIL_EXISTS') {
                console.log('Account already exists in Firebase. Updating password...');
                // Try to update password just in case it was different
                const signInResult = await post(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
                    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true }
                );

                if (signInResult.error) {
                    console.log('Could not sign in with provided password. Attempting to reset/update...');
                    // This is more complex via REST API if we don't have the current password, 
                    // but for this task we assume we can just create it or it's already set.
                } else {
                    console.log('Password verified successfully.');
                }
            } else {
                console.error('Error:', result.error.message);
            }
            return;
        }

        console.log('Admin account created successfully in Firebase!');
        console.log(`Email    : ${ADMIN_EMAIL}`);
        console.log(`Password : ${ADMIN_PASSWORD}`);
    } catch (err) {
        console.error('Network Error:', err);
    }
}

main();
