import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filePath = 'd:/project/verdi-trust-app/src/pages/Login.jsx';

try {
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`File size: ${stats.size} bytes`);
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('--- START FILE CONTENT ---');
        console.log(content);
        console.log('--- END FILE CONTENT ---');
    } else {
        console.log('File does not exist');
    }
} catch (e) {
    console.error('Error reading file:', e);
}
