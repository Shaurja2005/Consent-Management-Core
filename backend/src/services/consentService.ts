import { prisma } from '../index.js';
import crypto from 'crypto';

interface GrantConsentInput {
    userId: string; // Internal User ID or DID
    clientId: string;
    purposeId: string; // This expects the Purpose CODE (e.g. PAYMENT_INFO)
}

export const grantConsent = async (input: GrantConsentInput) => {
    const { userId, clientId, purposeId: purposeCode } = input;

    let user = await prisma.user.findUnique({ where: { did: userId } });
    if (!user) {
        user = await prisma.user.create({
            data: { did: userId },
        });
    }

    const purpose = await prisma.purpose.findUnique({ where: { code: purposeCode } });
    if (!purpose) {
        throw new Error(`Invalid Purpose Code: ${purposeCode}`);
    }

    const metadata = JSON.stringify({ userId, clientId, purposeCode, action: 'GRANT', timestamp: new Date().toISOString() });
    const hash = crypto.createHash('sha256').update(metadata).digest('hex');

    const auditLog = await prisma.auditLog.create({
        data: {
            action: 'GRANT_CONSENT',
            actor: userId,
            metadata: metadata,
            hash: hash,
        },
    });

    const consent = await prisma.consent.create({
        data: {
            userId: user.id,
            clientId: clientId,
            purposeId: purpose.id, // Use resolved UUID
            status: 'GRANTED',
            auditId: auditLog.id,
        },
        include: {
            purpose: true,
        },
    });

    return { consent, receipt: auditLog.id };
};

interface RevokeConsentInput {
    userId: string;
    clientId: string;
    purposeId: string; // Purpose CODE
}

export const revokeConsent = async (input: RevokeConsentInput) => {
    const { userId, clientId, purposeId: purposeCode } = input;

    const user = await prisma.user.findUnique({ where: { did: userId } });
    if (!user) throw new Error('User not found');

    const purpose = await prisma.purpose.findUnique({ where: { code: purposeCode } });
    if (!purpose) throw new Error('Invalid Purpose Code');

    const consent = await prisma.consent.findFirst({
        where: {
            userId: user.id,
            clientId,
            purposeId: purpose.id,
            status: 'GRANTED', // Only revoke if currently granted
        },
    });

    if (!consent) {
        throw new Error('No active consent found to revoke');
    }

    const metadata = JSON.stringify({ userId, clientId, purposeCode, action: 'REVOKE', timestamp: new Date().toISOString() });
    const hash = crypto.createHash('sha256').update(metadata).digest('hex');

    const auditLog = await prisma.auditLog.create({
        data: {
            action: 'REVOKE_CONSENT',
            actor: userId,
            metadata,
            hash,
        },
    });

    const updatedConsent = await prisma.consent.update({
        where: { id: consent.id },
        data: {
            status: 'REVOKED',
            auditId: auditLog.id,
        },
    });

    return { consent: updatedConsent, receipt: auditLog.id };
};

export const getUserConsents = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { did: userId } });
    if (!user) return [];

    return prisma.consent.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: { purpose: true },
    });
};
