import fs from 'fs';
const inPath = 'd:/project/verdi-trust-app/Login_content.txt';
const outPath = 'd:/project/verdi-trust-app/Login_decoded.jsx';

try {
    if (fs.existsSync(inPath)) {
        const content = fs.readFileSync(inPath, 'utf8').trim();
        const decoded = Buffer.from(content, 'base64').toString('utf8');
        fs.writeFileSync(outPath, decoded);
        console.log('Decoded successfully');
    }
} catch (e) {
    console.error('Error:', e);
}
