import express from 'express';
import morgan from 'morgan';
import env from './env.js';
import { cors, database } from './config/index.js';
import api from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(database);

app.use('/api', api);

const PORT = env.PORT || 3000;
const HOST = env.HOST || 'localhost';
app.listen(PORT, HOST, () => {
	console.log(`Server listening on http://${HOST}:${PORT}`);
});
