# Invoice-Bank matcher API


The Invoice-Bank Matcher API helps reconcile bank transactions with invoice data, which is often difficult due to the transactions and invoices originating from different systems. By matching data such as account numbers, amounts, currencies, and contractor details, the API identifies transactions that match invoices. It also highlights unmatched transactions for further review.

Additionally, the API can retrieve the most likely matching transaction for a specific invoice.

## API Endpoints


The API exposes 2 POST endpoints:


- `/mass-merge` : Finds the best possible matches between multiple invoices and transactions.
- `/invoice-finder` : Retrieves the best-matched transaction for a specific invoice.


## Usage flow

First, perform the mass merge to match the majority of transactions and invoices. For any remaining unmatched invoices, use the invoice-finder to view potential matches and decide manually which transaction to select.

## Mass-merge request payload


Send a JSON object with the following structure:

```json
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
```


* `bankObjects`: An array of bank transaction objects (derived from a CSV file).
* `invoiceObjects`: An array of invoice objects (based on data provided by accountants).

## Matching criteria


* The `invoiceObject.currency` must match `bankObject.currency` 
* The `bankObject.contractor` cannot be a financial entity (e.g., Revolut, PayPal).


The match is based on comparing the following fields between the invoice and transaction:

* account numbers
* amounts
* dates
* contractor names


## Mass-merge response
The API will return the following structure:

```json
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
```


* `matchedTransaction[n].matchDetails`: Transactions that were successfully matched to invoices.
* `unmatchedTransactions[]` : Transactions that could not be matched.
* `remainingInvoices[]` : Invoices that remain unmatched.

## Example mass-merge request

```bash
curl -X POST https://weexpert.ardium.pl/mass-merge \
-H "Content-Type: application/json" \
-d '{
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
    },
    ...
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
    },
    ...
  ]
}'
```
##Invoice finder

The invoice-finder endpoint allows you to retrieve the most probable transactions for a specific invoice.

## Invoice-finder request 

Send a JSON object where only one invoice is included:

```json
{
 "bankObjects": [],
 "invoiceObject":{
     "invoiceNumber": "101/8/2024/INV/GS/NYC",
     "issueDate": "2024-08-05",
     "salesDate": "2024-08-05",
     "contractor": "INTERNATIONAL FINANCE CORPORATION",
     "currency": "USD",
     "grossAmount": 1500,
     "nettAmount": 1234.57,
     "vatTax": 265.43,
     "accountNumber": "98765432101234567890123456"
   }
}
```

## Invoice-finder example usage


```bash
curl -X POST https://weexpert.ardium.pl/invoice-finder \
-H "Content-Type: application/json" \
-d '{
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
    },
    ...
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
    },
    ...
  ]
}'
```




## Invoice-finder example response

```json
[
  {
    "transaction": {
      "transactionCode": "21",
      "mBankCode": "770",
      "clientName": "COMPANY XYZ SPOLKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
      "amount": 150,
      "currency": "PLN",
      "transactionSide": "Uznania",
      "bookingDate": "03.07.2024",
      "accountNumber": "48114011400000234049001026",
      "currencyDate": "03.07.2024",
      "contractorAccountNumber": "39102011560000770201455138",
      "contractor": "JOHN DOE UL. EXAMPLE 123/1 12345 CITY",
      "transactionDescription": "JOHN DOE",
      "fullTransactionDescription": "770 Przelew krajowy",
      "trancationID": "z rach.: 39102011560000770201455138"
    },
    "checksPassed": 1,
    "checkDetails": {
      "accountNumberMatch": false,
      "amountMatch": false,
      "dateMatch": true,
      "contractorMatch": false
    }
  },
  {
    "transaction": {
      "transactionCode": "21",
      "mBankCode": "770",
      "clientName": "COMPANY XYZ SPOLKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
      "amount": 792,
      "currency": "PLN",
      "transactionSide": "Uznania",
      "bookingDate": "03.07.2024",
      "accountNumber": "40114011400000234049001267",
      "currencyDate": "03.07.2024",
      "contractorAccountNumber": "69102010420000870204531711",
      "contractor": "JANE SMITH UL. EXAMPLE STREET 1 12345 CITY",
      "transactionDescription": "ENGLISH COURSES",
      "fullTransactionDescription": "770 Przelew krajowy",
      "trancationID": "z rach.: 69102010420000870204531711"
    },
    "checksPassed": 1,
    "checkDetails": {
      "accountNumberMatch": false,
      "amountMatch": false,
      "dateMatch": true,
      "contractorMatch": false
    }
  },
  {
    "transaction": {
      "transactionCode": "21",
      "mBankCode": "770",
      "clientName": "COMPANY XYZ SPOLKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
      "amount": 10,
      "currency": "PLN",
      "transactionSide": "Uznania",
      "bookingDate": "03.07.2024",
      "accountNumber": "40114011400000234049001267",
      "currencyDate": "03.07.2024",
      "contractorAccountNumber": "69102040270000100218107730",
      "contractor": "ALAN DOE UL. SAMPLE AVENUE 12 67890 CITY",
      "transactionDescription": "TRIAL ENGLISH LESSON",
      "fullTransactionDescription": "770 Przelew krajowy",
      "trancationID": "z rach.: 69102040270000100218107730"
    },
    "checksPassed": 1,
    "checkDetails": {
      "accountNumberMatch": false,
      "amountMatch": false,
      "dateMatch": true,
      "contractorMatch": false
    }
  }
]
```


* The invoice-finder returns all the possible matches with a given invoice along with the number of checks passed and check details
* This endpoint can return an empty [] when no transactions matches the given invoice



