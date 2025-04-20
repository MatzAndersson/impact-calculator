import { useState } from "react";

export default function useCalculatorInputs() {
  const [inputs, setInputs] = useState({
    mode: "annual", // 'annual' | 'monthly' | 'lifetime'
    salaryNow: 120000,
    pledgePercent: 0.01, // % – used by annual + lifetime
    monthlyAmount: 100, // £/$ each month – used by monthly
    growthRate: 0.04,
    currentAge: 30,
    retirementAge: 65,
    currency: "USD",
  });

  const update = (key, value) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return { inputs, update };
}

