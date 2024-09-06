# Mass Merge API

## Overview

The Mass Merge API provides an endpoint to reconcile bank transactions with invoice data. By matching transactions based on criteria such as account number, amount, currency, and contractor information, the API identifies matched and unmatched transactions.

## Features

- Match bank transactions to invoice data.
- Identify unmatched transactions and remaining invoices.
- Perform custom matching logic based on currency, contractor names, and transaction details.

---

### Usage

## API Endpoint

POST /mass-merge

This endpoint reconciles bank transactions with invoices.

## Request Payload

The request body should be a JSON object with the following structure:

`
{
  "bankObjects": [
    {
      "transactionCode": "42",
      "mBankCode": "555",
      "clientName": "GLOBAL SOLUTIONS LIMITED",
      "amount": 1234.56,
      "currency": "USD",
      "transactionSide": "Debit",
      "bookingDate": "Tue Aug 01 2024 00:00:00 GMT+0200",
      "accountNumber": "12345678901234567890123456",
      "currencyDate": "Tue Aug 01 2024 00:00:00 GMT+0200",
      "contractorAccountNumber": "65432109876543210987654321",
      "contractor": "JOHN DOE 123 MAIN ST, ANYTOWN, USA",
      "transactionDescription": "JOHN DOE/JULY",
      "fullTransactionDescription": "555 Domestic transfer",
      "transactionID": "from account: 65432109876543210987654321"
    }
  ],
  "invoiceObjects": [
    {
      "invoiceNumber": "101/8/2024/INV/GS/NYC",
      "issueDate": "05.08.2024",
      "salesDate": "05.08.2024",
      "contractor": "INTERNATIONAL FINANCE CORPORATION",
      "currency": "USD",
      "grossAmount": 1500,
      "nettAmount": 1234.57,
      "vatTax": 265.43,
      "accountNumber": "98765432101234567890123456"
    }
  ]
}
`

**bankObjects**: An array of bank transaction objects.  
**invoiceObjects**: An array of invoice objects.

## Response

The API responds with a JSON object that includes:

`
{
  "matchedTransactions": [
    {
      "transactionCode": "42",
      "mBankCode": "555",
      "clientName": "GLOBAL SOLUTIONS LIMITED",
      "amount": 1234.56,
      "currency": "USD",
      "transactionSide": "Debit",
      "bookingDate": "Tue Aug 01 2024",
      "accountNumber": "12345678901234567890123456",
      "currencyDate": "Tue Aug 01 2024",
      "contractorAccountNumber": "65432109876543210987654321",
      "contractor": "JOHN DOE 123 MAIN ST, ANYTOWN, USA",
      "transactionDescription": "JOHN DOE/JULY",
      "matchDetails": "Invoice 101/8/2024/INV/GS/NYC"
    }
  ],
  "unmatchedTransactions": [],
  "remainingInvoices": []
}
`

## Tracing the invoice to bank transaction 

**matchDetails**: contains the invoice number that was matched with a given bank transaction 
