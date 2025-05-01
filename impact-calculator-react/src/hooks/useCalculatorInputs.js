import { useState, } from "react";

export default function useCalculatorInputs() {
  const [inputs, setInputs] = useState({
    mode: "annual", // 'annual' | 'monthly' | 'lifetime'
    salaryNow: "",
    pledgePercent: 0.01, // % – used by annual + lifetime
    monthlySalary: "", // £/$ each month – used by monthly
    growthRate: 4,
    currentAge: "",
    retirementAge: "",
    salaryPeriod: "annual", // 'annual' | 'monthly'
    currency: "USD",
  });

  const update = (key, value) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return { inputs, update };
}
