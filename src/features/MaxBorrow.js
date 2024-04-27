// 获取address
// 获取历史交易
// 计算信用值

function calculateCreditScore(totalTransactions, averageAmount) {
  const score = Math.min(850, 300 + totalTransactions * 2 + averageAmount / 0.000000000000000001);
  return {
    totalTransactions,
    averageAmount,
    score
  };
}

const result = calculateCreditScore(30, 0.01);
//返回最大借款金额
module.exports.maxValue = result.score;
