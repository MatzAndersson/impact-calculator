/**
 * @param salaryNow       number   – user’s current annual salary
 * @param pledgePercent   number   – eg 0.01 for 1 %
 * @param growthRate      number   – eg 0.04 for 4 % (real, above inflation)
 * @param currentAge      number
 * @param retirementAge   number
 * @param costPerDeathUSD number   – GiveWell figure (default $4 500)
 * @returns { deaths: number, lifetimeGiving: number }
 */
export default function calculateLifetimeImpact({
  salaryNow,
  pledgePercent = 0.01,
  growthRate = 0.04,
  currentAge,
  retirementAge,
  costPerDeathUSD = 4500
}) {
  const years = Math.max(0, retirementAge - currentAge);
  if (!salaryNow || years <= 0) return { livesSaved: 0, lifetimeGiving: 0 };

  // closed-form sum of geometric progression
  const totalEarned =
    salaryNow * ((Math.pow(1 + growthRate, years) - 1) / growthRate);

  const lifetimeGiving = totalEarned * pledgePercent;
  const livesSaved = Math.floor(lifetimeGiving / costPerDeathUSD);

  return { livesSaved, lifetimeGiving };
}