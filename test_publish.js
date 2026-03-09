const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testPublish() {
    const formData = new FormData();
    formData.append('project_source', 'tree plantation');
    formData.append('volume', '2000');
    formData.append('price', '50');
    formData.append('type', 'Nature');
    formData.append('vintage', '2024');

    // we don't need files for the backend to crash if it does, but wait, the backend doesn't require files unless it's uploaded!
    // No, if no files, then req.files might be undefined!

    // In express: const certificate_file = req.files['certificate_file'] ? req.files['certificate_file'][0].filename : null; 
    // Wait, if req.files is undefined, then req.files['certificate_file'] will throw a TypeError: Cannot read properties of undefined (reading 'certificate_file')!!!

    try {
        const res = await fetch('http://localhost:3005/api/listings', {
            method: 'POST',
            body: formData,
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (err) {
        console.error('Error:', err);
    }
}
testPublish();
