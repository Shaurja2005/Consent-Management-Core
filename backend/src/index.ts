import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

import consentRoutes from './routes/consentRoutes.js';

app.use(cors());
app.use(express.json());

app.use('/api/v1/consent', consentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Consent Management System API', status: 'active' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { prisma };
