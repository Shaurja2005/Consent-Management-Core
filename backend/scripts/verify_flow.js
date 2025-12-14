
async function runTest() {
    const baseUrl = 'http://localhost:3000/api/v1/consent';
    const headers = { 'Content-Type': 'application/json' };

    const testData = { userId: 'user-test-1', clientId: 'client-app-1', purposeId: 'PAYMENT_INFO' };

    console.log('--- Step 1: Grant Consent ---');
    const grantRes = await fetch(`${baseUrl}/grant`, { method: 'POST', headers, body: JSON.stringify(testData) });
    const grantJson = await grantRes.json();
    console.log('Status:', grantRes.status);
    console.log('Response:', grantJson);
    if (grantRes.status !== 201) throw new Error('Grant failed');

    console.log('\n--- Step 2: List Consents (Should be 1) ---');
    const listRes1 = await fetch(`${baseUrl}/list?userId=${testData.userId}`);
    const listJson1 = await listRes1.json();
    console.log('Consents:', listJson1.length);
    if (listJson1.length !== 1) throw new Error('List should have 1 item');

    console.log('\n--- Step 3: Revoke Consent ---');
    const revokeRes = await fetch(`${baseUrl}/revoke`, { method: 'POST', headers, body: JSON.stringify(testData) });
    const revokeJson = await revokeRes.json();
    console.log('Status:', revokeRes.status);
    console.log('Response:', revokeJson);
    if (revokeRes.status !== 200) throw new Error('Revoke failed');

    console.log('\n--- Step 4: List Consents (Should be 0) ---');
    const listRes2 = await fetch(`${baseUrl}/list?userId=${testData.userId}`);
    const listJson2 = await listRes2.json();
    console.log('Consents:', listJson2.length);
    if (listJson2.length !== 0) throw new Error('List should have 0 items');

    console.log('\n✅ VERIFICATION SUCCESSFUL');
}

runTest().catch(err => console.error('❌ FAILED:', err));
