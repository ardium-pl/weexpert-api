export function convertInvoiceData(invoice) {

    const transformedInvoice = {
        salesDate: convertDateFormat(invoice['DATA SPRZEDAżY']),
        issueDate: convertDateFormat(invoice['DATA WYSTAWIENIA']),
        contractor: invoice['NAZWA KONTRAHENTA'],
        accountNumber: formatAccountNumber(invoice['NUMER RACHUNKU']),
        currency: invoice.WALUTA,
        grossAmount: parseInt(invoice['WARTOŚĆ BRUTTO'], 10),
        nettAmount: parseInt(invoice['WARTOŚĆ NETTO'], 10),
    };
    return transformedInvoice;
}

function convertDateFormat(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
}

function formatAccountNumber(accountStr) {
    // Removes anything that's not a digit
    return accountStr.replace(/\D/g, '');
}

// Example usage:
const originalInvoice = {
    'NUMER FAKTURY': '0118/12/2023',
    'DATA WYSTAWIENIA': '2023-12-11',
    'DATA SPRZEDAżY': '2023-11-13',
    'NAZWA KONTRAHENTA': 'Hongkong Aivee International Technology Co.',
    WALUTA: 'USD',
    'WARTOść NETTO': '400',
    'WARTOść BRUTTO': '400',
    'WARTOść VAT': '0',
    'NUMER RACHUNKU': 'PL39 1140 1140 0000 3132 3300 1003'
  };

const convertedInvoice = convertInvoiceData(originalInvoice);
console.log(convertedInvoice);
