import express from 'express';
import routes from './routes/index.js';

import cors from 'cors';

import cookieParser from 'cookie-parser';

import './cron-jobs/index.js';

const app = express();

app.use(express.json());

// app.use(cors());
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5167'],
    credentials: true,
}));
app.use(cookieParser());

app.use(routes);

app.listen(3000)