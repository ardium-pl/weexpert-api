export function reconcileTransactions(bankTransactions, invoices) {
    // Map each transaction to include check results
    return bankTransactions.map(transaction => {
        const matchResult = findMatchingInvoiceAndCheckResults(transaction, invoices);
        if (matchResult.matchFound) {
            return null; // Exclude transactions with a matching invoice
        } else {
            return {
                ...transaction,
                checkResults: matchResult.checkResults // Include details on which checks were met and which were not
            };
        }
    }).filter(transaction => transaction !== null); // Filter out null values, i.e., transactions that had a matching invoice
}

function findMatchingInvoiceAndCheckResults(transaction, invoices) {
    for (let invoice of invoices) {
        if (transaction.currency === invoice.currency && transaction.accountNumber === invoice.accountNumber) {
            const { checksPassed, checkDetails } = performAdditionalChecks(transaction, invoice);
            if (checksPassed >= 2) {
                return { matchFound: true }; // Matching invoice found, no need to include check results
            } else {
                // Provide detailed check results for transactions that don't fully match
                return { matchFound: false, checkResults: checkDetails };
            }
        }
    }
    // No invoices match even the non-negotiable criteria
    return { matchFound: false, checkResults: ["Non-negotiable criteria not met"] };
}

function performAdditionalChecks(transaction, invoice) {
    const checkDetails = {
        amountMatch: transaction.amount === invoice.grossAmount,
        dateMatch: transaction.bookingDate === invoice.salesDate,
        contractorMatch: isPartialMatch(transaction.contractor, invoice.contractor)
    };

    const checksPassed = Object.values(checkDetails).filter(Boolean).length;

    return { checksPassed, checkDetails };
}

function isPartialMatch(transactionContractor, invoiceContractor) {
    const lowercasedTransactionContractor = transactionContractor.toLowerCase();
    const lowercasedInvoiceContractor = invoiceContractor.toLowerCase().split(' ').slice(1).join(' ');
    
    return lowercasedTransactionContractor.includes(lowercasedInvoiceContractor);
}