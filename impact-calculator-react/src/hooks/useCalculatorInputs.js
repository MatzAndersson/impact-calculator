import { useState, } from "react";

function initialInputs() {
  return {
    mode: "annual", // 'annual' | 'monthly' | 'lifetime'
    salaryNow: "",
    pledgePercent: 0.01, // % – used by annual + lifetime
    monthlySalary: "", // £/$ each month – used by monthly
    growthRate: 4,
    currentAge: "",
    retirementAge: "",
    salaryPeriod: "annual", // 'annual' | 'monthly'
    currency: "USD",
  };
}

export default function useCalculatorInputs() {
  const [inputs, setInputs] = useState(initialInputs());
   

  const update = (key, value) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const resetAll = () => setInputs(initialInputs());

  return { inputs, update, resetAll };
}
