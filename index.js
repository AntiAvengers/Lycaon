import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config';

import express from 'express';
import routes from './routes/index.js';

import cors from 'cors';

import cookieParser from 'cookie-parser';

import './cron-jobs/index.js';

const app = express();

app.use(express.json());

app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
}));

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

app.use(cookieParser());

app.use(routes);

app.listen(3000)