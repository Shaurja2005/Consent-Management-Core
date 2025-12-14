const { ConsentCMS } = require('sdk');

const cms = new ConsentCMS({
    apiUrl: 'http://localhost:3000/api/v1/consent',
    clientId: 'dummy-app-1'
});

async function main() {
    const userId = 'user-' + Date.now();
    const purpose = 'MARKETING';

    console.log(`Testing with User: ${userId}, Purpose: ${purpose}`);

    // 1. Consent should be false initially
    const initialCheck = await cms.hasConsent(userId, purpose);
    console.log('Initial Consent:', initialCheck); // Should be false

    // 2. Grant
    console.log('Granting consent...');
    const grantReceipt = await cms.grantConsent(userId, purpose);
    console.log('Grant Receipt:', grantReceipt.receipt);

    // 3. Check again
    const grantedCheck = await cms.hasConsent(userId, purpose);
    console.log('Granted Consent Check:', grantedCheck); // Should be true
    if (!grantedCheck) throw new Error('Grant failed');

    // 4. Revoke
    console.log('Revoking consent...');
    const revokeReceipt = await cms.revokeConsent(userId, purpose);
    console.log('Revoke Receipt:', revokeReceipt.receipt);

    // 5. Check
    const revokedCheck = await cms.hasConsent(userId, purpose);
    console.log('Revoked Consent Check:', revokedCheck); // Should be false
    if (revokedCheck) throw new Error('Revoke failed');

    console.log('✅ SUCCESS: Interoperability Test Passed');
}

main().catch(err => {
    console.error('❌ FAILED:', err);
    process.exit(1);
});
