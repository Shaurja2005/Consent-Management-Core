import type { Request, Response } from 'express';
import * as consentService from '../services/consentService.js';

export const grantConsent = async (req: Request, res: Response) => {
    try {
        const { userId, clientId, purposeId } = req.body;

        if (!userId || !clientId || !purposeId) {
            res.status(400).json({ error: 'Missing required fields: userId, clientId, purposeId' });
            return;
        }

        const result = await consentService.grantConsent({ userId, clientId, purposeId });
        res.status(201).json(result);
    } catch (error) {
        console.error('Grant Consent Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const revokeConsent = async (req: Request, res: Response) => {
    try {
        const { userId, clientId, purposeId } = req.body;

        if (!userId || !clientId || !purposeId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const result = await consentService.revokeConsent({ userId, clientId, purposeId });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Revocation failed' });
    }
};

export const getUserConsents = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (typeof userId !== 'string') {
            res.status(400).json({ error: 'Invalid userId' });
            return;
        }

        const consents = await consentService.getUserConsents(userId);
        res.json(consents);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
