const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');

app.use(express.json());

// Input API key and API URL
const ETHERSCAN_API_KEY = 'JIZZMGHYYD46MICJIFYVZNXRA5UKBMHDP5';
const ETHERSCAN_API_URL = 'https://api-sepolia.etherscan.io/api';

// Convert Wei to Ether 
function convertWeiToEther(weiValue) {
  return parseFloat(weiValue) / 1e18;
}
// Calculate credit score based on transaction history 
function calculateCreditScore(totalTransactions, averageAmount) {
  const score = 300 
                + Math.min(Math.log10(1 + totalTransactions) * 100, 300) 
                + Math.min(Math.log10(1 + averageAmount) * 1000, 250);
  return score;
}
// Calculate the maximum loan amount based on credit score 
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
// Get transaction history from Etherscan
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
    // Fetch transaction list from Etherscan
    const response = await axios.get(`${ETHERSCAN_API_URL}?${params.toString()}`);
    if (!Array.isArray(response.data.result)) {
      throw new Error('The response from the Etherscan API is not an array');
    }
    // Convert transaction values to Ether and prepare transaction summary
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
    console.log('Transaction summary with credit score and max loan amount has been written to transaction_summary.json');

    return resultData;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
// Endpoint to handle POST request for transaction history
app.post('/get-transaction-history', async (req, res) => {
  const address = req.body.address;
  try {
    const summary = await getTransactionHistory(address);
    res.json(summary);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});   