import { useState, useEffect } from "react";

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

   // 1) When slider (pledgePercent) or salary changes, update monthlyAmount
   useEffect(() => {
    if (inputs.mode === "monthly") return;
    const m = (inputs.salaryNow * inputs.pledgePercent) / 12;
    update("monthlyAmount", Number(m.toFixed(2)));
  }, [inputs.pledgePercent, inputs.salaryNow, inputs.mode]);

  // 2) When monthly amount changes in monthly mode, update pledgePercent
  useEffect(() => {
    if (inputs.mode !== "monthly") return;
    const p = inputs.salaryNow > 0
      ? (inputs.monthlyAmount * 12) / inputs.salaryNow
      : 0;
    update("pledgePercent", Number(p.toFixed(4)));
  }, [inputs.monthlyAmount, inputs.salaryNow, inputs.mode]);

  return { inputs, update };
}

