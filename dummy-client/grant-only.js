const { ConsentCMS } = require('sdk');

const cms = new ConsentCMS({
    apiUrl: 'http://localhost:3000/api/v1/consent',
    clientId: 'dummy-app-1'
});

async function main() {
    const userId = 'user-' + Date.now();
    const purpose = 'MARKETING';

    console.log(`\n🚀 Starting Grant-Only Test`);
    console.log(`👤 User: ${userId}`);
    console.log(`🎯 Purpose: ${purpose}`);

    // 1. Grant
    console.log('👉 Granting consent...');
    const grantReceipt = await cms.grantConsent(userId, purpose);
    console.log('✅ Grant Receipt:', grantReceipt.receipt);

    console.log('\n✨ Consent GRANTED! Check your dashboard now.');
    console.log(`📋 ID to copy: ${userId}`);
}

main().catch(err => {
    console.error('❌ FAILED:', err);
    process.exit(1);
});
