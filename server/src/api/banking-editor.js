export function reconcileTransactions(bankTransactions, invoices) {
    let matchedTransactions = [];
    let unmatchedTransactions = [];

    bankTransactions.forEach(transaction => {
        const matchResult = findMatchingInvoiceAndCheckResults(transaction, invoices);
        if (matchResult.matchFound) {
            // If a matching invoice is found, add the transaction to matchedTransactions
            matchedTransactions.push({
                ...transaction,
                matchDetails: matchResult.checkResults // Details on why it was considered a match
            });
        } else {
            unmatchedTransactions.push({
                ...transaction,
                checkResults: matchResult.checkResults // Details on why it didn't match
            });
        }
    });

    return {
        matchedTransactions,
        unmatchedTransactions
    };
}

function findMatchingInvoiceAndCheckResults(transaction, invoices) {
    for (let invoice of invoices) {
        if (transaction.currency === invoice.currency && transaction.accountNumber === invoice.accountNumber) {
            const { checksPassed, checkDetails } = performAdditionalChecks(transaction, invoice);
            if (checksPassed >= 2) {
                return { matchFound: true, checkResults: checkDetails };
            } else {
                return { matchFound: false, checkResults: checkDetails };
            }
        }
    }
    return { matchFound: false, checkResults: {nonNegotiableCriteriaNotMet: true} };
}

function performAdditionalChecks(transaction, invoice) {
    const checkDetails = {
        amountMatch: transaction.amount === invoice.grossAmount,
        dateMatch: transaction.bookingDate === invoice.salesDate,
        contractorMatch: contractorNameCheck(transaction.contractor, invoice.contractor)
    };

    const checksPassed = Object.values(checkDetails).filter(Boolean).length;
    return { checksPassed, checkDetails };
}

function contractorNameCheck(transactionContractor, invoiceContractor) {
    
    const lowercasedTransactionContractor = transactionContractor.toLowerCase().split(' ');
    const lowercasedInvoiceContractor = invoiceContractor.toLowerCase().split(' ').slice(0,1);
    
    return lowercasedTransactionContractor.includes(lowercasedInvoiceContractor[0]);
}