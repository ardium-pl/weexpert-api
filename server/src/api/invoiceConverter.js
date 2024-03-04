export function csvToJson(csvString) {
  const lines = csvString.split("\n").filter((line) => line.trim() !== "");
  const headers = lines[0].split(";").map((header) => mapHeader(header));

  const jsonResult = lines.slice(1).map((row) => {
    const values = row.split(";").map((value) => value.trim());
    const invoice = headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
    return convertInvoiceData(invoice);
  });

  return jsonResult;
}

function mapHeader(header) {
  const headerMappings = {
    "NUMER FAKTURY": "invoiceNumber",
    "DATA WYSTAWIENIA": "issueDate",
    "DATA SPRZEDAżY": "salesDate",
    "NAZWA KONTRAHENTA": "contractor",
    WALUTA: "currency",
    "WARTOść NETTO": "nettAmount",
    "WARTOść BRUTTO": "grossAmount",
    "WARTOść VAT": "vatTax",
    "NUMER RACHUNKU": "accountNumber",
  };
  const trimmedHeader = header.trim();
  const mappedHeader = headerMappings[trimmedHeader] || trimmedHeader;

  return mappedHeader;
}

function convertInvoiceData(invoice) {
  return {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: convertDateFormat(invoice.issueDate),
    salesDate: convertDateFormat(invoice.salesDate),
    contractor: invoice.contractor,
    currency: invoice.currency,
    grossAmount: parseInt(invoice.grossAmount, 10),
    nettAmount: parseInt(invoice.nettAmount, 10),
    vatTax: parseInt(invoice.vatTax,10),
    accountNumber: formatAccountNumber(invoice.accountNumber),
  };
}

function convertDateFormat(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function formatAccountNumber(accountStr) {
  return accountStr.replace(/\D/g, "");
}
