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

  // 1) Pre-compute all three donation amounts
  const annualDonation = inputs.salaryNow * inputs.pledgePercent;
  const monthlyDonation = inputs.monthlyAmount;
  const lifetimeDonation = (() => {
    if (!calculated) return 0;

    // lifetime = sum over all years with growth
    const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
    const r = Math.max(0.000001, inputs.growthRate / 100);
    const earned = (inputs.salaryNow * ((1 + r) ** years - 1)) / r;
    return Math.max(0, earned * inputs.pledgePercent);
  })();

  const monthlyAmount =
    inputs.mode === "monthly"
      ? Math.max(0, monthlyDonation)
      : annualDonation / 12;

  return (
    <section className={pageStyles.icWrapper}>
      <div className={pageStyles.icPanel}>
        <InputTabs value={inputs.mode} onChange={(val) => update("mode", val)}>
          <AnnualForm
            value="annual"
            label="Annual"
            inputs={inputs}
            update={update}
          />
          <MonthlyForm
            value="monthly"
            label="Monthly"
            inputs={inputs}
            update={update}
          />
          <LifetimeForm
            value="lifetime"
            label="Lifetime"
            inputs={inputs}
            update={update}
          />
        </InputTabs>
        {/* ---------- slider OR monthly preview ---------- */}
        {(inputs.mode === "annual" || inputs.mode === "lifetime") && (
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

        {/* live preview, always shown */}
        <div className={pageStyles.annualDonation}>
          {inputs.mode === "annual" && (
            <>Annual donation: {fmt(annualDonation)}</>
          )}

          {inputs.mode === "monthly" && (
            <>
              Based on annual salary:{" "}
              <strong>{fmt(Number(inputs.salaryNow) || 0)}</strong>
              <br />
              Monthly donation: {fmt(monthlyAmount)}
              <br />
              Equivalent pledge: {(inputs.pledgePercent * 100).toFixed(2)}%
            </>
          )}

          {inputs.mode === "lifetime" && (
            <>
              Lifetime donation: {fmt(lifetimeDonation)}
              <br />
              Over {inputs.retirementAge - inputs.currentAge} years
            </>
          )}
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
