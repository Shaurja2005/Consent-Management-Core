import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const purposes = [
        { code: 'PAYMENT_INFO', description: 'Processing payments', retentionPeriod: 365 },
        { code: 'ANALYTICS', description: 'Improving user experience', retentionPeriod: 90 },
        { code: 'MARKETING', description: 'Sending promotional offers', retentionPeriod: 30 },
    ];

    for (const p of purposes) {
        await prisma.purpose.upsert({
            where: { code: p.code },
            update: {},
            create: p,
        });
    }

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
