import { Router } from 'express';
import * as consentController from '../controllers/consentController.js';

const router = Router();

router.post('/grant', consentController.grantConsent);
router.post('/revoke', consentController.revokeConsent);
router.get('/list', consentController.getUserConsents);

export default router;
