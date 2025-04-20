import { useState } from "react";
import useCalculatorInputs from "../hooks/useCalculatorInputs";
import { InputTabs } from "../components/calculator/InputTabs";
import { AnnualForm } from "../components/calculator/AnnualForm";
import { MonthlyForm } from "../components/calculator/MonthlyForm";
import { LifetimeForm } from "../components/calculator/LifetimeForm";
import { CharityCards } from "../components/CharityCards";
//import { ImpactSummary } from "../components/ImpactSummary";
import pageStyles from "./ImpactCalculatorPage.module.css";

export default function ImpactCalculatorPage() {
  const { inputs, update } = useCalculatorInputs();
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => setCalculated(true);

  const fmt = (value) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: inputs.currency,
      maximumFractionDigits: 0,
    });

  // Calculate annual donation based on the selected mode
  const annualDonation = (() => {
    if (!calculated) return 0;

    switch (inputs.mode) {
      case "monthly":
        // Use the explicit monthlyAmount input
        return Math.max(0, inputs.monthlyAmount) * 12;

      case "annual":
        return Math.max(0, inputs.salaryNow * inputs.pledgePercent);

      case "lifetime": {
        const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
        // prevent division by zero
        const growthRate = Math.max(0.000001, inputs.growthRate);
        const totalEarned =
          (inputs.salaryNow * ((1 + growthRate) ** years - 1)) / growthRate;
        return Math.max(0, totalEarned * inputs.pledgePercent);
      }

      default:
        return 0;
    }
  })();

  const monthlyAmount =
    inputs.mode === "monthly"
      ? Math.max(0, inputs.monthlyAmount || 0)
      : annualDonation / 12;

  return (
    <section className={pageStyles.icWrapper}>
      <div className={pageStyles.icPanel}>
        <InputTabs value={inputs.mode} onChange={(val) => update("mode", val)}>
          <AnnualForm label="annual" inputs={inputs} update={update} />
          <MonthlyForm label="monthly" inputs={inputs} update={update} />
          <LifetimeForm label="lifetime" inputs={inputs} update={update} />
        </InputTabs>
        {/* ---------- slider OR monthly preview ---------- */}
        {inputs.mode !== "monthly" && (
          <div className={pageStyles.rangeWrapper}>
            <label htmlFor="pledgePercent" className={pageStyles.rangeLabel}>
              I’d like to donate&nbsp;
              <span className={pageStyles.highlight}>
                {(inputs.pledgePercent * 100).toFixed(1)}%
              </span>
            </label>

            <input
              id="pledgePercent"
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={inputs.pledgePercent * 100}
              onChange={(e) =>
                update("pledgePercent", Number(e.target.value) / 100)
              }
            />
          </div>
        )}
        /* ---------- live preview (always shown) ---------- */
        <div className="annual-donation">
          {inputs.mode === "monthly"
            ? `Monthly donation: ${fmt(monthlyAmount)}`
            : `Annual donation: ${fmt(annualDonation)}`}
        </div>
        <button
          className={pageStyles.calculateBtn}
          onClick={handleCalculate}
          disabled={inputs.salaryNow <= 0}
        >
          Calculate donation
        </button>
      </div>

      {calculated && (
        <>
          <CharityCards annualDonation={annualDonation} />
        </>
      )}
    </section>
  );
}
