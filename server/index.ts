import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { trpcExpress } from './routers';
import cookieParser from 'cookie-parser';
import { validateENV } from './helpers/validateENV';
import otpEmailTemplate from './helpers/otpEmailTemplate';
export * from './routers';

dotenv.config();

const envValidation = validateENV();

if (!envValidation.success) {
  console.error(envValidation.error);
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.get('/', (_req, res) => res.send('This is your server.'));

app.get('/health', (_req, res) =>
  res.json({ message: 'OK', timestamp: Date.now() }),
);

app.get('/otp-email-template', (_req, res) => {
  return res.send(
    otpEmailTemplate({
      otp: '123456',
      to: 'test@example.com',
      exp: new Date(),
    }),
  );
});

app.use('/api', trpcExpress);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
