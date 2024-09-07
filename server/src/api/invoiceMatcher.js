import { nonFinancialVendor, performAdditionalChecks } from "./massMerge.js";

export function invoiceMatchFinder(invoice, bankTransactions) {
  const matches = bankTransactions
    .filter((transaction) => checkForInvoice(transaction, invoice))
    .map((transaction) => checkForInvoice(transaction, invoice));

  return matches.sort((a, b) => b.checksPassed - a.checksPassed);
}

function checkForInvoice(transaction, invoice) {
  if (
    transaction.currency !== invoice.currency ||
    !nonFinancialVendor(transaction.contractor)
  ) {
    return null;
  }

  const { checksPassed, checkDetails } = performAdditionalChecks(
    transaction,
    invoice
  );

  return checksPassed === 0
    ? null
    : { transaction, checksPassed, checkDetails };
}
