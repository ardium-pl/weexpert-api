import dayjs from "dayjs";

export function reconcileTransactions(bankTransactions, invoices) {
  let matchedTransactions = [];
  let unmatchedTransactions = [];
  let remainingInvoices = [...invoices];

  bankTransactions.forEach((transaction) => {
    const matchResult = findMatchingInvoice(transaction, remainingInvoices);
    transaction.currencyDate = formatDate(transaction.currencyDate);
    transaction.bookingDate = formatDate(transaction.bookingDate);

    if (matchResult.matchFound) {
      removeInvoiceFromRemaining(
        remainingInvoices,
        matchResult.invoiceData.invoice
      );
      matchedTransactions.push({
        ...transaction,
        matchDetails: matchResult.invoiceData.invoice.invoiceNumber,
      });
      return;
    }
    unmatchedTransactions.push({
      ...transaction,
      checkResults: matchResult.checkResults,
    });
  });

  return {
    matchedTransactions,
    unmatchedTransactions,
    remainingInvoices,
  };
}

function findMatchingInvoice(transaction, invoices) {
  const checkSweetSpot = 2;
  const potentialMatches = invoices
    .filter(
      (invoice) =>
        transaction.currency === invoice.currency &&
        nonFinancialVendor(transaction.contractor)
    )
    .map((invoice) => ({
      invoice,
      ...performAdditionalChecks(transaction, invoice),
    }))
    .sort((a, b) => b.checksPassed - a.checksPassed);

  const [bestMatch, secondMatch] = potentialMatches;
  if (!bestMatch || bestMatch.checksPassed < checkSweetSpot) {
    return {
      matchFound: false,
      invoiceData: { nonNegotiableCriteriaNotMet: true },
    };
  }

  return {
    matchFound: bestMatch.checksPassed !== secondMatch?.checksPassed,
    invoiceData: bestMatch,
  };
}

export function performAdditionalChecks(transaction, invoice) {
  const checkDetails = {
    accountNumberMatch: transaction.accountNumber === invoice.accountNumber,
    amountMatch: transaction.amount === invoice.grossAmount,
    dateMatch: transaction.bookingDate === invoice.salesDate,
    contractorMatch: contractorNameCheck(
      transaction.contractor,
      invoice.contractor
    ),
  };

  const checksPassed = Object.values(checkDetails).reduce(
    (count, passed) => count + passed,
    0
  );
  return { checksPassed, checkDetails };
}

export function contractorNameCheck(transactionContractor, invoiceContractor) {
  const sanitizedTransactionContractor = transactionContractor
    .replace(/[1\/,"]/g, "")
    .toLowerCase();
  const [sanitizedInvoiceContractor] = invoiceContractor
    .replace(/[,"]/g, "")
    .toLowerCase()
    .split(" ");

  return sanitizedTransactionContractor.includes(sanitizedInvoiceContractor);
}

export function nonFinancialVendor(contractor) {
  return !/^Revolut|PAYPAL/.test(contractor);
}

function formatDate(dateString) {
  return dayjs(dateString).isValid()
    ? dayjs(dateString).format("DD.MM.YYYY")
    : (() => {
        throw new Error("Invalid date string");
      })();
}

function removeInvoiceFromRemaining(remainingInvoices, invoice) {
  const index = remainingInvoices.findIndex((inv) => inv === invoice);
  if (index > -1) remainingInvoices.splice(index, 1);
}
