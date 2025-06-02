export function getCharityImpacts({
  salaryNow,
  currentAge,
  retirementAge,
  allocations,
  charities,
  conversionRate = 1,
  growthRate = 0.04,
  pledgePercent = 0.01 // 1%
}) {
  const years = retirementAge - currentAge;
  if (years <= 0 || !salaryNow) return charities.map(c => ({
    ...c, 
    impactAmount: 0, 
    units: 0,
    preventedDeaths: 0,
    moneyLocal: 0,
    pct: allocations[c.id] || 0,
  }));

  const lifetimeGiving =
    salaryNow * pledgePercent *
    ((Math.pow(1 + growthRate, years) - 1) / growthRate);

  return charities.map((c) => {
    const pct = allocations[c.id] || 0;
    const moneyLocal = (lifetimeGiving * pct) / 100 * conversionRate;
    const units =
      c.costPerOutputUSD > 0 ? Math.round(moneyLocal / c.costPerOutputUSD) : 0;
    const preventedDeaths =
      c.costPerDeathAvertedUSD > 0 ? moneyLocal / c.costPerDeathAvertedUSD : 0;
    return {
      ...c,
      impactAmount: units,
      units, // for summary
      preventedDeaths, // for summary
      moneyLocal,
      pct
    };
  });
}
