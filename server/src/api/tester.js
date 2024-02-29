// In testReconciliation.js
import { reconcileTransactions } from "./banking-editor.js";

// Test data for bank transactions and invoices
const bankTransactions = [
    {
        bookingDate: "13.11.2023",
        contractor: "HONGKONG AIVEE INTERNATIONAL TECHNOLOGY CO LIMITED RM 08 20/F WITTY COMMERCIAL BLDG 1A 1L TUNG CHOI ST MONGKOK KLN HONG KONG",
        amount: "400",
        accountNumber: "39114011400000313233001003",
        currency: "USD"
    },
    {
        bookingDate: "13.11.2023",
        contractor: "HONGKONG AIVEE INTERNATIONAL TECHNOLOGY CO LIMITED RM 08 20/F WITTY COMMERCIAL BLDG 1A 1L TUNG CHOI ST MONGKOK KLN HONG KONG",
        amount: "400",
        accountNumber: "39114011400000313233001003",
        currency: "PLN"
    },
    {
        bookingDate: "13.11.2023",
        contractor: "HONGKONG AIVEE INTERNATIONAL TECHNOLOGY CO LIMITED RM 08 20/F WITTY COMMERCIAL BLDG 1A 1L TUNG CHOI ST MONGKOK KLN HONG KONG",
        amount: "400",
        accountNumber: "39114011400000313233001003",
        currency: "EUR"
    }
];

const invoices = [
    {
        salesDate: "13.11.2023",
        issueDate: "2023-12-11",
        contractor: "Hongkong Aivee International Technology Co.",
        accountNumber: "39114011400000313233001003",
        currency: "USD",
        grossAmount: "400",
        nettAmount: "400"
    }
];

/**
 * Test function to run reconciliation process with provided example data.
 */
function testReconciliation() {
    const filteredTransactions = reconcileTransactions(bankTransactions, invoices);
    console.log('Filtered Transactions:', filteredTransactions);
}

// Call the test function
testReconciliation();
