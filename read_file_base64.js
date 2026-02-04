import fs from 'fs';
const filePath = 'd:/project/verdi-trust-app/src/pages/Login.jsx';
const outPath = 'd:/project/verdi-trust-app/Login_content.txt';

try {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'base64');
        fs.writeFileSync(outPath, content);
        console.log('Done writing base64');
    }
} catch (e) {
    console.error('Error:', e);
}
