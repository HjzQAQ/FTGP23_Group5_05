function calculateCreditScore(totalTransactions, averageAmount) {
  const score = Math.min(850, 300 + totalTransactions * 2 + averageAmount / 0.000000000000000001);
  return {
    totalTransactions,
    averageAmount,
    score
  };
}

  const totalTransactions = parseInt(process.argv[2]);
  const averageAmount = parseFloat(process.argv[3]);

const result = calculateCreditScore(totalTransactions, averageAmount);
//   console.log(result);

export const MaxValue = result;
