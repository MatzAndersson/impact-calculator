import { useState, useEffect } from "react";

export default function useCalculatorInputs() {
  const [inputs, setInputs] = useState({
    mode: "annual", // 'annual' | 'monthly' | 'lifetime'
    salaryNow: "",
    pledgePercent: 0.01, // % – used by annual + lifetime
    monthlyAmount: "", // £/$ each month – used by monthly
    growthRate: 4,
    currentAge: "",
    retirementAge: "",
    currency: "USD",
  });

  const update = (key, value) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

   // 1) When slider (pledgePercent) or salary changes, update monthlyAmount
   useEffect(() => {
    if (inputs.mode === "monthly") return;

    const salary = parseFloat(inputs.salaryNow);
    if (isNaN(salary)) {
      // user cleared salary → clear monthlyAmount
      update("monthlyAmount", "");
      return;
    }
    const m = (salary * inputs.pledgePercent) / 12;
    update("monthlyAmount", m.toFixed(2));
  }, [inputs.salaryNow, inputs.pledgePercent, inputs.mode]);

  // 2) When monthly amount changes in monthly mode, update pledgePercent
  useEffect(() => {
    if (inputs.mode !== "monthly") return;

    const salary = parseFloat(inputs.salaryNow);
    const monthly = parseFloat(inputs.monthlyAmount);
    if (!isNaN(salary) && salary > 0 && !isNaN(monthly)) {
      const p = (monthly * 12) / salary;
      update("pledgePercent", Number(p.toFixed(4)));
    }
    // otherwise do nothing — leave the 0.01 default in state
  }, [inputs.monthlyAmount, inputs.salaryNow, inputs.mode]);

  return { inputs, update };
}

