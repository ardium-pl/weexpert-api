export function invoiceMatchFinder(invoice, bankTransactions){
    let potencialMatches = [];

    bankTransactions.forEach((transaction) => {
        const matchResult = checkForSimilarInvoice(transaction,invoice);
        potencialMatches.push(matchResult);
    });
    potencialMatches.sort((a, b) => b.checksPassed - a.checksPassed);
    
    //shorten potencial matches to 5 or less positions
    potencialMatches.length > 5 ? potencialMatches.slice(0,5): potencialMatches;
    if(potencialMatches.length > 5){
        return potencialMatches.slice(0,5);
    }

    return potencialMatches;
}

function checkForSimilarInvoice(transaction, invoice) {
    if (transaction.currency === invoice.currency) {
        const { checksPassed, checkDetails } = performAdditionalChecks(
        transaction,
        invoice
        );

        return{
        transaction: transaction, 
        checksPassed: checksPassed,
        checkDetails: checkDetails,
        };
    }
    return{
        transaction: transaction, 
        checksPassed: 0,
        checkDetails: "Wrong currency",
    }
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
        .replace(/1/, '') //delete trailing /1
        .replace(/\//g, '') //delete trailing /1
        .replace(/,/g, '')
        .replace(/"/g, '')   
        .toLowerCase()
        .split(" ");

    const lowercasedInvoiceContractor = invoiceContractor
        .replace(/,/g, '') 
        .replace(/"/g, '')   
        .toLowerCase()
        .split(" ")
        .slice(0, 1);

    return lowercasedTransactionContractor.includes(
        lowercasedInvoiceContractor[0]
    );
}  