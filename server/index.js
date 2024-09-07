import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { weExpertRouter } from './src/routes/router.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api', weExpertRouter);

app.listen(port, () => {
  logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
  console.log(`Server running on port ${port}, NODE_ENV: ${process.env.NODE_ENV}`);
});



export default app;
