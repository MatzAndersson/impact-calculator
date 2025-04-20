import React, { useState } from "react";

import useCalculatorInputs from "../hooks/useCalculatorInputs";
import { InputTabs } from "../components/calculator/InputTabs";
import { AnnualForm } from "../components/calculator/AnnualForm";
import { LifetimeForm } from "../components/calculator/LifetimeForm";
import { CharityList } from "../components/CharityList";
import { ImpactSummary } from "../components/ImpactSummary";

export default function ImpactCalculatorPage() {
  const { inputs, update } = useCalculatorInputs();
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => setCalculated(true);

  /* --- derive donation --- */
  const annualDonation = (() => {
    if (!calculated) return 0;
    if (inputs.mode === "monthly")
      return (inputs.salaryNow / 12) * inputs.pledgePercent;
    if (inputs.mode === "annual")
      return inputs.salaryNow * inputs.pledgePercent;

    // lifetime
    const years = inputs.retirementAge - inputs.currentAge;
    const totalEarned =
      (inputs.salaryNow * ((1 + inputs.growthRate) ** years - 1)) /
      inputs.growthRate;
    return totalEarned * inputs.pledgePercent;
  })();

  return (
    <section className="ic-wrapper">
      <div className="ic-panel">
        <InputTabs value={inputs.mode} onChange={(val) => update("mode", val)}>
          <AnnualForm label="annual" inputs={inputs} update={update} />
          <MonthlyForm label="monthly" inputs={inputs} update={update} />
          <LifetimeForm label="lifetime" inputs={inputs} update={update} />
        </InputTabs>

        {/* slider + percent (reuse your existing markup) */}

        <button className="calculate-btn" onClick={handleCalculate}>
          Calculate donation
        </button>
      </div>

      {calculated && (
        <>
          <CharityList annualDonation={annualDonation} />
          <ImpactSummary annualDonation={annualDonation} inputs={inputs} />
        </>
      )}
    </section>
  );
}
