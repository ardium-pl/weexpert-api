export function reconcileTransactions(bankTransactions, invoices) {
  let matchedTransactions = [];
  let unmatchedTransactions = [];
  let remainingInvoices = [...invoices]; // Clone the invoices array to avoid modifying the original array directly

  bankTransactions.forEach((transaction) => {
    const matchResult = findMatchingInvoiceAndCheckResults(
      transaction,
      remainingInvoices
    );
    if (matchResult.matchFound) {

        const invoice = matchResult.invoiceData.invoice;

        for(let i = 0; i < remainingInvoices.length; i++){
            if(remainingInvoices[i] == invoice){
                remainingInvoices.splice(i,1);
                break;
            }
        }

      matchedTransactions.push({...transaction, matchDetails: matchResult.invoiceData.checkDetails});

    } else {
      unmatchedTransactions.push({
        ...transaction,
        checkResults: matchResult.checkResults, // Details on why it didn't match
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
      if (transaction.currency === invoice.currency) {
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
    if(invoiceWithMostChecks && invoiceWithMostChecks.checksPassed >= 2){
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
