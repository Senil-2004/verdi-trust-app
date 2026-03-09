/**
 * Updates the admin Firebase account password: admin@gmail.com -> admin123
 * By signing in first to get an ID token.
 */

const https = require('https');

const API_KEY = 'AIzaSyAdAvjyDiSDKs3J-z36u7sb6mC-ATXPdAs';
const ADMIN_EMAIL = 'admin@gmail.com';
const OLD_PASSWORD = 'admin123';
const NEW_PASSWORD = 'admin123'; // Can be changed here

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
    console.log(`Authenticating ${ADMIN_EMAIL}...`);

    // Sign in to get ID token
    const login = await post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        { email: ADMIN_EMAIL, password: OLD_PASSWORD, returnSecureToken: true }
    );

    if (login.error) {
        console.error('Login failed:', login.error.message);
        console.log('Maybe the password was already changed? Trying a direct signup toggle might work or just manually resetting via Firebase console is the fallback. But let\'s try one more thing: just creating a new specific admin account if this fails.');
        return;
    }

    const idToken = login.idToken;
    console.log(`Login successful. Updating password...`);

    // Now update the password using the ID token
    const result = await post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        { idToken, password: NEW_PASSWORD, returnSecureToken: false }
    );

    if (result.error) {
        console.error('Error updating password:', result.error.message);
        return;
    }

    console.log('✅ Admin password updated successfully!');
    console.log(`Email    : ${ADMIN_EMAIL}`);
    console.log(`Password : ${NEW_PASSWORD}`);
}

main();
