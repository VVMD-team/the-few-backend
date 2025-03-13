import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from '@/routes';
import errorHandler from '@/middlewares/errorHandler';
import { whitelist } from '@/config/whitelist';
import { envVars } from '@/config/env';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://trusted-scripts.com'],
        objectSrc: ["'none'"],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use('/api', routes);

app.use(errorHandler);

app.listen(envVars.PORT, () => {
  console.log(`🚀 Server is running on port ${envVars.PORT}`);
});
