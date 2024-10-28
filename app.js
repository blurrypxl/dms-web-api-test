import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import accounts from './controllers/accounts.js';
import auth from './controllers/auth.js';
import aid from './controllers/aid.js';

dotenv.config();

const app = express();
const port = process.env.NODE_ENV === 'production' ? process.env.SERVER_PORT_PROD : 3000;
const siteOrigin = process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN_PROD : '*';

app.use(cors({ origin: siteOrigin, optionsSuccessStatus: 200 }));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// API Server
app.use('/v1/api/test', (req, res) => {
  res.json('API is Running Baby!');
});
app.use('/v1/api/auth', auth);
app.use('/v1/api/accounts', accounts);
app.use('/v1/api/aid', aid);

// 404 Error
app.use((req, res, next) => {
  const err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

// Error's Handler
app.use((err, req, res, next) => {
  const error = {
    status: err.status || 500,
    message: err.message
  }
  res.status(error.status || 500).json(error);
});

app.listen(port, () => {
  console.log(`Server running on port ${port} with Worker PID: ${process.pid}`);
});
