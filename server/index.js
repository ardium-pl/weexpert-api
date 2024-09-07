import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { weExpertRouter } from './src/routes/router.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  methods: ['GET', 'POST'], // Ensure POST is included
  origin: '*', // Or your specific domain
}));

app.use('/api/weex', weExpertRouter);

app.listen(port, () => {
  logger.info(`Serwer SOR uruchomiony na porcie ${port}`);
  console.log(`Server running on port ${port}, NODE_ENV: ${process.env.NODE_ENV}`);
});

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path);
  }
});


export default app;
