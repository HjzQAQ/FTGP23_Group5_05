const express = require('express');
const app = express();
const axios = require('axios'); // Import Axios
const fs = require('fs');

app.use(express.json());

const ETHERSCAN_API_KEY = 'JIZZMGHYYD46MICJIFYVZNXRA5UKBMHDP5';
const ETHERSCAN_API_URL = 'https://api-sepolia.etherscan.io/api'; //sepolia testnet api

function convertWeiToEther(weiValue) {
  return parseFloat(weiValue) / 1e18;
}

function calculateCreditScore(totalTransactions, averageAmount) {
  const score =
    300 + Math.min(Math.log10(1 + totalTransactions) * 100, 300) + Math.min(Math.log10(1 + averageAmount) * 1000, 250);
  return score;
}

function calculateMaxLoanAmount(score) {
  if (score < 580) {
    return 0.5;
  } else if (score < 670) {
    return 0.5 + (score - 580) * (1.0 / 90);
  } else if (score < 740) {
    return 1.5 + (score - 670) * (1.0 / 70);
  } else if (score < 800) {
    return 2.5 + (score - 740) * (1.0 / 60);
  } else if (score <= 850) {
    return 3.5 + (score - 800) * (1.5 / 50);
  }
  return 5.0;
}

async function getTransactionHistory(address) {
  try {
    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: 0,
      endblock: 99999999,
      sort: 'asc',
      apikey: ETHERSCAN_API_KEY
    });

    const response = await axios.get(`${ETHERSCAN_API_URL}?${params.toString()}`);
    if (!Array.isArray(response.data.result)) {
      throw new Error('The response from the Etherscan API is not an array');
    }

    const transactions = response.data.result.map(tx => ({
      valueInEther: convertWeiToEther(tx.value)
    }));

    const totalTransactions = transactions.length;
    const averageTransactionValue = transactions.reduce((acc, tx) => acc + tx.valueInEther, 0) / totalTransactions;
    const creditScore = calculateCreditScore(totalTransactions, averageTransactionValue);
    const maxLoanAmount = calculateMaxLoanAmount(creditScore);

    const resultData = {
      totalTransactions: totalTransactions,
      averageAmount: averageTransactionValue,
      credit: creditScore,
      maxLoanAmount: maxLoanAmount
    };

    fs.writeFileSync('transaction_summary.json', JSON.stringify(resultData, null, 2), 'utf-8');
    console.log(
      'Transaction summary with credit score and max loan amount has been written to transaction_summary.json'
    );

    return resultData;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

const address = '0xe276bc378a527a8792b353cdca5b5e53263dfb9e'; // Wrap address in quotes
getTransactionHistory(address)
  .then(summary => console.log(summary))
  .catch(error => console.error(error));
