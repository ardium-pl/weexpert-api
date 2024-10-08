import express from 'express';
import { reconcileTransactions } from "../api/massMerge.js";
import { invoiceMatchFinder } from "../api/invoiceMatcher.js";

export const weExpertRouter = express.Router();



weExpertRouter.post('/mass-merge', async (req, res, next) => {
  try {
    const body = req.body;
    const bankObjects = body.bankObjects;
    const invoiceObjects = body.invoiceObjects;

    if (!bankObjects || !invoiceObjects) {
      return res.status(400).json({ message: 'Wrong input data' });
    }

    const result = reconcileTransactions(bankObjects, invoiceObjects);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

weExpertRouter.post('/invoice-finder', async (req, res, next) => {
  try {
    const body = req.body;
    const bankObjects = body.bankObjects;
    const invoiceObject = body.invoiceObject;

    if (!bankObjects || !invoiceObject) {
      return res.status(400).json({ message: 'Wrong input data' });
    }
    const result = invoiceMatchFinder(invoiceObject, bankObjects);

    if(!result){
      console.log('No matches found')
      return res.status(400).json({ message: 'No mateches found' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});