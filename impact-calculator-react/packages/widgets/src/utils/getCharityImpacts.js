export function getCharityImpacts({
  salaryNow,
  currentAge,
  retirementAge,
  allocations,
  charities,
  conversionRate = 1,
  growthRate = 0.04,
  pledgePercent = 0.01, // 1%
}) {
  const years = retirementAge - currentAge;
  if (years <= 0 || !salaryNow)
    return charities.map((c) => ({
      ...c,
      impactAmount: 0,
      units: 0,
      preventedDeaths: 0,
      moneyLocal: 0,
      pct: allocations[c.id] || 0,
    }));

  const lifetimeGiving =
    salaryNow *
    pledgePercent *
    ((Math.pow(1 + growthRate, years) - 1) / growthRate);

  return charities.map((c) => {
    const pct = allocations[c.id] || 0;
    const moneyLocal = (lifetimeGiving * pct) / 100;
    const localCostPerDeath = c.costPerDeathAvertedUSD * conversionRate;
    const localCostPerOutput = c.costPerOutputUSD * conversionRate;
    const preventedDeaths =
      localCostPerDeath > 0 ? moneyLocal / localCostPerDeath : 0;
    const units =
      localCostPerOutput > 0 ? Math.round(moneyLocal / localCostPerOutput) : 0;
    

    return {
      ...c,
      impactAmount: units,
      units, // for summary
      preventedDeaths, // for summary
      moneyLocal,
      pct,
    };
  });
}
