import express from 'express';
import { reconcileTransactions } from "../api/massMerge.js"

export const weExpertRouter = express.Router();



weExpertRouter.post('/mass-merge', async (req, res, next) => {
  try {
    const body = req.body;
    const bankObjects = body.bankObjects;
    const invoiceObjects = body.invoiceObjects;

    if (!bankObjects || !invoiceObjects) {
      return res.status(400).json({ message: 'Nieprawidłowe dane' });
    }

    const result = reconcileTransactions(bankObjects, invoiceObjects);

    res.json(result);
  } catch (error) {
    next(error);
  }
});
