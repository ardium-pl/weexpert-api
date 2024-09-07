import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { weExpertRouter } from './src/routes/router.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use(weExpertRouter);

app.listen(port, () => {
  logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
});

export default app;
