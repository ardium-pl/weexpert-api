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

```json
{
  "bankObjects": [
    {
      "transactionCode": "21",
      "mBankCode": "770",
      "clientName": "MIGRANT EXPERT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
      "amount": 430.5,
      "currency": "PLN",
      "transactionSide": "Uznania",
      "bookingDate": "Mon Jul 01 2024 00:00:00 GMT+0200",
      "accountNumber": "75114011400000234049001025",
      "currencyDate": "Mon Jul 01 2024 00:00:00 GMT+0200",
      "contractorAccountNumber": "45102011690000810208467419",
      "contractor": "ULADZISLAU SHYTSIK UL. KOLEJOWA 47A M.126 01-210 WARSZAWA",
      "transactionDescription": "ULADZISLAU SHYTSIK/CZERWIEC",
      "fullTransactionDescription": "770 Przelew krajowy",
      "transactionID": "z rach.: 45102011690000810208467419"
    }
  ],
  "invoiceObjects": [
    {
      "invoiceNumber": "29/7/2024/MK0/FS/ME/WRO",
      "issueDate": "03.07.2024",
      "salesDate": "03.07.2024",
      "contractor": "FINANCE EXPERT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
      "currency": "PLN",
      "grossAmount": 340,
      "nettAmount": 276.42,
      "vatTax": 63.58,
      "accountNumber": "47109023980000000147820334"
    }
  ]
}

**bankObjects**: An array of bank transaction objects.  
**invoiceObjects**: An array of invoice objects.

## Response

The API responds with a JSON object that includes:

```json
{
  "matchedTransactions": [
    {
      "transactionCode": "21",
      "mBankCode": "770",
      "clientName": "MIGRANT EXPERT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
      "amount": 430.5,
      "currency": "PLN",
      "transactionSide": "Uznania",
      "bookingDate": "Mon Jul 01 2024",
      "accountNumber": "75114011400000234049001025",
      "currencyDate": "Mon Jul 01 2024",
      "contractorAccountNumber": "45102011690000810208467419",
      "contractor": "ULADZISLAU SHYTSIK UL. KOLEJOWA 47A M.126 01-210 WARSZAWA",
      "transactionDescription": "ULADZISLAU SHYTSIK/CZERWIEC",
      "matchDetails": "Invoice 29/7/2024/MK0/FS/ME/WRO"
    }
  ],
  "unmatchedTransactions": [],
  "remainingInvoices": []
}
