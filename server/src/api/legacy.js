function reconcileTransactions(bankTransactions, invoices) {
    let matchedTransactions = [];
    let unmatchedTransactions = [];
    let remainingInvoices = [...invoices];
    
    bankTransactions.forEach(transaction => {
      const matchResult = findMatchingInvoiceAndCheckResults(
        transaction,
        remainingInvoices
      );
      transaction.currencyDate = formatDateString(transaction.currencyDate);
      transaction.bookingDate = formatDateString(transaction.bookingDate);
      if (matchResult.matchFound) {
  
          const invoice = matchResult.invoiceData.invoice;
  
          for(let i = 0; i < remainingInvoices.length; i++){
              if(remainingInvoices[i] == invoice){
                  remainingInvoices.splice(i,1);
                  break;
              }
          }
  
        //matchedTransactions.push({...transaction, matchDetails: matchResult.invoiceData.checkDetails}); //let' see how it works
        matchedTransactions.push({...transaction, matchDetails: matchResult.invoiceData.invoice.invoiceNumber});
  
      } else {
        unmatchedTransactions.push({
          ...transaction,
          checkResults: matchResult.checkResults,
        });
      }
    });
  
    return {
      matchedTransactions,
      unmatchedTransactions,
      remainingInvoices,
    };
  }
  
  function findMatchingInvoiceAndCheckResults(transaction, invoices) {
    let potencialMatches = [];
  
      for (let invoice of invoices) {
        if (transaction.currency === invoice.currency && nonFinancialVendor(transaction.contractor)) {
          const { checksPassed, checkDetails } = performAdditionalChecks(
            transaction,
            invoice
          );
  
          potencialMatches.push({
            invoice: invoice,
            checksPassed: checksPassed,
            checkDetails: checkDetails,
          });
        }
      }
      //Sorting the potencialMatches array in descending order of checksPassed
      potencialMatches.sort((a, b) => b.checksPassed - a.checksPassed);
  
      const invoiceWithMostChecks = potencialMatches.length > 0 ? potencialMatches[0] : null;
      if(invoiceWithMostChecks && invoiceWithMostChecks.checksPassed >= 2){ // normly 2 with 218 matches; 4 with 7 matches XD; 
        if(potencialMatches[1] && invoiceWithMostChecks.checksPassed === potencialMatches[1].checksPassed){
          return {matchFound: false, invoiceData:invoiceWithMostChecks}
        }
          return { matchFound: true, invoiceData: invoiceWithMostChecks  };
      } 
      else return {matchFound: false, invoiceData: { nonNegotiableCriteriaNotMet: true }};
  }
  
  function performAdditionalChecks(transaction, invoice) {
      const checkDetails = {
          accountNumberMatch: transaction.accountNumber === invoice.accountNumber,
          amountMatch: transaction.amount === invoice.grossAmount,
          dateMatch: transaction.bookingDate === invoice.salesDate,
          contractorMatch: contractorNameCheck(transaction.contractor,invoice.contractor)
      };
    const checksPassed = Object.values(checkDetails).filter(Boolean).length;
    return { checksPassed, checkDetails };
  }
  
  function contractorNameCheck(transactionContractor, invoiceContractor) {
    const lowercasedTransactionContractor = transactionContractor
      .replace(/1/, "") //delete trailing /1
      .replace(/\//g, "") //delete trailing /1
      .replace(/,/g, "")
      .replace(/"/g, "")
      .toLowerCase()
      .split(" ");
  
    const lowercasedInvoiceContractor = invoiceContractor
      .replace(/,/g, "")
      .replace(/"/g, "")
      .toLowerCase()
      .split(" ")
      .slice(0, 1);
  
    return lowercasedTransactionContractor.includes(lowercasedInvoiceContractor[0]);
  }
  
  function nonFinancialVendor(contractor){
    const contractorSplitName = contractor.split(" ");
    if(!["Revolut", "PAYPAL"].includes(contractorSplitName[0])){
      return true;
    }else{
      return false;
    }
  }
  
  function formatDateString(dateString) {
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      Logger.log(dateString)
      throw new Error('Invalid date string');
    }
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }