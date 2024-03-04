export function csvBankToJson(csvString) {
    const lines = csvString.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(";").map((header) => mapHeader(header));
  
    const jsonResult = lines.slice(1).map((row) => {
      const values = row.split(";").map((value) => value.trim());
      const bankEntry = headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
      return convertBankingData(bankEntry); 
    });
  
    return jsonResult;
  }
  
  function mapHeader(header) {
    const headerMappings = {
      "Kod transakcji ERP": "transactionCode",
      "Kod transakcji mBank": "mBankCode",
      "Nazwa klienta": "clientName",
      "Kwota": "amount",
      "Waluta": "currency",
      "Strona transakcji": "transactionSide",
      "Data":"date",
      "Data ksi©gowania": "bookingDate",
      "Numer rachunku": "accountNumber",
      "Data waluty": "currencyDate",
      "Rachunek kontrahenta": "contractorAccountNumber",
      "Kontrahent": "contractor",
      "Opis transakcji": "transactionDescription",
      "Pe€ny opis transakcji": "fullTransactionDescription", 
      "Id transakcji" : "trancationID"

    };
    const trimmedHeader = header.trim();
    const mappedHeader = headerMappings[trimmedHeader] || trimmedHeader;
  
    return mappedHeader;
  }


  function convertBankingData(bankEntry) {
    return {
        transactionCode: bankEntry.transactionCode,
        mBankCode: bankEntry.mBankCode,
        clientName: bankEntry.clientName,
        amount: parseInt(bankEntry.amount,10),
        currency: bankEntry.currency,
        transactionSide: bankEntry.transactionSide,
        date: bankEntry.date,
        bookingDate: bankEntry.bookingDate,
        accountNumber: formatAccountNumber(bankEntry.accountNumber),
        currencyDate: bankEntry.currencyDate,
        contractorAccountNumber: formatAccountNumber(bankEntry.contractorAccountNumber),
        contractor: bankEntry.contractor,
        transactionDescription: bankEntry.transactionDescription,
        fullTransactionDescription: bankEntry.fullTransactionDescription,
        trancationID: bankEntry.trancationID
    };
  }


  function formatAccountNumber(accountStr) {
    return accountStr.replace(/'/g, "");
  }