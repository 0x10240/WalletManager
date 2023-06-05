async function calculateScore(data) {
  let score = 0;

  // contractActivity
  const contractActivityThresholds = [4, 10, 25, 100];
  const contractActivity = data.contractActivity;
  score += calculateThresholdScore(contractActivity, contractActivityThresholds);

  // dayActivity
  const dayActivityThresholds = [7, 21, 49];
  const dayActivity = data.dayActivity;
  score += calculateThresholdScore(dayActivity, dayActivityThresholds);

  // l1Tol2Amount
  const l1Tol2AmountThresholds = [0.1, 1, 10];
  const l1Tol2Amount = parseFloat(data.l1Tol2Amount);
  score += calculateThresholdScore(l1Tol2Amount, l1Tol2AmountThresholds);

  // l1Tol2Times
  const l1Tol2TimesThresholds = [1, 3];
  const l1Tol2Times = data.l1Tol2Times;
  score += calculateThresholdScore(l1Tol2Times, l1Tol2TimesThresholds, true);

  // monthActivity
  const monthActivityThresholds = [2, 6, 9];
  const monthActivity = data.monthActivity;
  score += calculateThresholdScore(monthActivity, monthActivityThresholds);

  // totalExchangeAmount
  const totalExchangeAmountThresholds = [1000, 10000, 50000, 250000];
  const totalExchangeAmount = parseFloat(data.totalExchangeAmount);
  score += calculateThresholdScore(totalExchangeAmount, totalExchangeAmountThresholds);

  // weekActivity
  const weekActivityThresholds = [4, 8, 12];
  const weekActivity = data.weekActivity;
  score += calculateThresholdScore(weekActivity, weekActivityThresholds, true);

  // zks1_tx_amount
  const zks1_tx_amountThresholds = [3, 5, 10];
  const zks1_tx_amount = data.zks1_tx_amount;
  score += calculateThresholdScore(zks1_tx_amount, zks1_tx_amountThresholds);

  // zks2_balance
  const zks2_balanceThresholds = [0.01, 0.1, 1];
  const zks2_balance = parseFloat(data.zks2_balance);
  if (zks2_balance >= 0.005) {
    score += calculateThresholdScore(zks2_balance, zks2_balanceThresholds);
  } else {
    score -= 1; // Deduct 1 point if zks2_balance is below 0.005
  }

  // zks2_tx_amount
  const zks2_tx_amountThresholds = [4, 10, 25, 100];
  const zks2_tx_amount = data.zks2_tx_amount;
  score += calculateThresholdScore(zks2_tx_amount, zks2_tx_amountThresholds);

  return score;
}

function calculateThresholdScore(value, thresholds, deductZero = false) {
  if (deductZero && value === 0) {
    return -1; // Deduct 1 point if value is zero
  }

  let score = 0;
  for (const threshold of thresholds) {
    if (value >= threshold) {
      score += 1; // Increment score by 1 for each threshold reached
    } else {
      break; // Break loop if value is below threshold
    }
  }
  return score;
}

export default calculateScore;