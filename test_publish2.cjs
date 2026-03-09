async function testPublish() {
    const formData = new FormData();
    formData.append('project_source', 'tree plantation');
    formData.append('volume', '2000');
    formData.append('price', '50');
    formData.append('type', 'Nature');
    formData.append('vintage', '2024');

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
