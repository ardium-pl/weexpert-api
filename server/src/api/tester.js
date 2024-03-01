// In testReconciliation.js
import { reconcileTransactions } from "./banking-editor.js";

// Test data for bank transactions and invoices
const bankTransactions = [
    {
        bookingDate: "13.11.2023",
        contractor: "HONGKONG AIVEE INTERNATIONAL TECHNOLOGY CO LIMITED RM 08 20/F WITTY COMMERCIAL BLDG 1A 1L TUNG CHOI ST MONGKOK KLN HONG KONG",
        amount: 400,
        accountNumber: "39114011400000313233001003",
        currency: "USD"
    },
    {
        bookingDate: "13.11.2023",
        contractor: "HONGKONG AIVEE INTERNATIONAL TECHNOLOGY CO LIMITED RM 08 20/F WITTY COMMERCIAL BLDG 1A 1L TUNG CHOI ST MONGKOK KLN HONG KONG",
        amount: 400,
        accountNumber: "39114011400000313233001003",
        currency: "PLN"
    },
    {
        bookingDate: "13.11.2023",
        contractor: "HONGKONG AIVEE INTERNATIONAL TECHNOLOGY CO LIMITED RM 08 20/F WITTY COMMERCIAL BLDG 1A 1L TUNG CHOI ST MONGKOK KLN HONG KONG",
        amount: 400,
        accountNumber: "39114011400000313233001003",
        currency: "EUR"
    },
    {
        bookingDate: "16.11.2023",
        contractor: "DARIDA LIMITED 2B LAWENDOWE WZGORZE STREET APT 7 GDANSK 80175 PL",
        amount: 2396.26,
        accountNumber: "68114011400000313233001257",
        currency: "USD"
    }
        
];

const invoices = [
    {
        salesDate: "13.11.2023",
        issueDate: "2023-12-11",
        contractor: "Hongkong Aivee International Technology Co.",
        accountNumber: "39114011400000313233001003",
        currency: "USD",
        grossAmount: 400,
        nettAmount: 400
    },
    {
        salesDate: "16.11.2023",
        issueDate: "12.11.2023",
        contractor: "DARIDA LIMITED",
        accountNumber: "68114011400000313233001257",
        currency: "USD",
        grossAmount: 2400,
        nettAmount: 2400,
    } 
        
];

/**
 * Test function to run reconciliation process with provided example data.
 */
function testReconciliation() {
    const filteredTransactions = reconcileTransactions(bankTransactions, invoices);
    console.log(filteredTransactions);
}

// Call the test function
testReconciliation();
