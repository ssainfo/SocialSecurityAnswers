const { MongoClient } = require('mongodb');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const {
    age, earnedIncome, unearnedIncome, resources, workYears, disability, marital, visa,
    parents, parentEarned, parentUnearned, siblings
  } = JSON.parse(event.body);

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('ssaanswers');
  const rules = await db.collection('ssa_rules').findOne({ year: 2025 }) || {
    fbrIndividual: 967, fbrCouple: 1450, childAllocation: 484, maxBenefit: 4018
  };

  // SSI Calculation
  let countableUnearned = Math.max(0, unearnedIncome - 20);
  let countableEarned = earnedIncome > 0 ? Math.max(0, (earnedIncome - 65) / 2) : 0;
  let deemedIncome = 0;

  if (age < 18 && parents !== 'none') {
    let parentTotalUnearned = parentUnearned - (siblings * rules.childAllocation);
    let parentTotalEarned = parentEarned - Math.max(0, (siblings * rules.childAllocation - parentUnearned));
    let parentCountableUnearned = Math.max(0, parentTotalUnearned - 20);
    let parentCountableEarned = parentTotalEarned > 0 ? Math.max(0, (parentTotalEarned - 65) / 2) : 0;
    let parentLivingAllowance = parents === 'one' ? rules.fbrIndividual : rules.fbrCouple;
    deemedIncome = Math.max(0, (parentCountableUnearned + parentCountableEarned - parentLivingAllowance));
    countableUnearned += deemedIncome;
  }

  let totalCountable = countableUnearned + countableEarned;
  let ssiEligible = (resources <= (marital === 'married' ? 3000 : 2000)) && (visa !== 'other');
  let ssiAmount = ssiEligible ? Math.max(0, rules.fbrIndividual - totalCountable) : 0;

  // SSDI Calculation
  const ssdiEligible = disability === 'yes' && workYears >= 5 && age < 67;
  let ssdiAmount = ssdiEligible ? Math.min(rules.maxBenefit, workYears * 80) : 0;

  // Retirement Calculation
  let retirementAmount = 0;
  if (age >= 62 && workYears >= 10) {
    const base = Math.min(rules.maxBenefit, workYears * 100);
    retirementAmount = age < 67 ? base * 0.7 : (age > 70 ? base * 1.24 : base);
  }

  // Medicare
  let medicareResult = age >= 65 ? 'Eligible (Part A free, Part B ~$185/month)' : 'Not eligible';
  if (totalCountable * 12 < 14580 && resources < 2000) medicareResult += ', may qualify for Medicaid/QMB';

  await client.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      ssi: ssiEligible ? ssiAmount : 'Not eligible',
      ssdi: ssdiEligible ? ssdiAmount : 'Not eligible',
      retirement: retirementAmount ? Math.round(retirementAmount) : 'Not eligible',
      medicare: medicareResult,
      deemedIncome
    })
  };
};
