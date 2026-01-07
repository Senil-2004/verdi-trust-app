const fs = require('fs');
const path = 'd:/project/verdi-trust-app/src/pages/Login.jsx';

try {
    const content = fs.readFileSync(path, 'utf8');
    console.log('--- START FILE CONTENT ---');
    console.log(content);
    console.log('--- END FILE CONTENT ---');
} catch (e) {
    console.error('Error reading file:', e);
}
