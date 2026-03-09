import { supabase } from './src/lib/supabase.js';

async function testStorageUpload() {
    console.log('Testing storage upload to uploads bucket...');

    // Create a simple test file (a tiny text blob)
    const testContent = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const fileName = `test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, testContent, { contentType: 'text/plain' });

    if (error) {
        console.error('UPLOAD FAILED:', error.message, error.statusCode);
        console.error('Full error:', JSON.stringify(error, null, 2));
    } else {
        console.log('UPLOAD SUCCESS:', data);
        // Clean up
        await supabase.storage.from('uploads').remove([fileName]);
        console.log('Cleaned up test file');
    }
}

testStorageUpload();
