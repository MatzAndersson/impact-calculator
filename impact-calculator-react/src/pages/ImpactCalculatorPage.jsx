import { useState } from "react";
import useCalculatorInputs from "../hooks/useCalculatorInputs";
import { InputTabs } from "../components/calculator/InputTabs";
import { AnnualForm } from "../components/calculator/AnnualForm";
import { MonthlyForm } from "../components/calculator/MonthlyForm";
import { LifetimeForm } from "../components/calculator/LifetimeForm";
import { CharityCards } from "../components/CharityCards";
import { CHARITIES } from "../data/charityData";
import { ImpactSummary } from "../components/ImpactSummary";

import pageStyles from "./ImpactCalculatorPage.module.css";

export default function ImpactCalculatorPage() {
  const { inputs, update } = useCalculatorInputs();
  const [calculatedDonation, setCalculatedDonation] = useState(0);

  const [mode, setMode] = useState("equal");
  const [allocations, setAllocations] = useState(() =>
    CHARITIES.reduce(
      (acc, c) => ({ ...acc, [c.id]: 100 / CHARITIES.length }),
      {}
    )
  );

  const handleCalculate = () => {
    let donation = 0;

    if (inputs.mode === "annual") {
      donation = inputs.salaryNow * inputs.pledgePercent;
    } else if (inputs.mode === "monthly") {
      // monthlyAmount is already the user's input per month
      donation = inputs.monthlyAmount * 12;
    } else if (inputs.mode === "lifetime") {
      const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
      const r = Math.max(0.000001, inputs.growthRate / 100);
      const earned = (inputs.salaryNow * ((1 + r) ** years - 1)) / r;
      donation = earned * inputs.pledgePercent;
    }

    setCalculatedDonation(donation);
  };

  const fmt = (value) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: inputs.currency,
      maximumFractionDigits: 0,
    });

  // 1) Calculate all three donation amounts
  const annualDonation = inputs.salaryNow * inputs.pledgePercent;
  const monthlyDonation = inputs.monthlyAmount;
  const lifetimeDonation = (() => {
    const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
    const r = Math.max(0.000001, inputs.growthRate / 100);
    return (
      ((inputs.salaryNow * ((1 + r) ** years - 1)) / r) * inputs.pledgePercent
    );
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

        <fieldset className={pageStyles.allocationToggle}>
          <legend>
            How should we split your donation across the top charities?
          </legend>
          <label>
            <input
              type="radio"
              value="equal"
              checked={mode === "equal"}
              onChange={() => {
                setMode("equal");
                setAllocations(
                  CHARITIES.reduce(
                    (acc, c) => ({ ...acc, [c.id]: 100 / CHARITIES.length }),
                    {}
                  )
                );
              }}
            />{" "}
            Split equally (25% each)
          </label>

          <label>
            <input
              type="radio"
              value="custom"
              checked={mode === "custom"}
              onChange={() => setMode("custom")}
            />{" "}
            Customize split (set your own percentages)
          </label>
        </fieldset>

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

      <>
        <CharityCards
          annualDonation={calculatedDonation}
          allocations={allocations}
          onAllocationChange={(id, pct) => {
            setAllocations((prev) => ({
              ...prev,
              [id]: pct,
            }));
          }}
          mode={mode}
        />
      </>
      {calculatedDonation > 0 && (
        <ImpactSummary
          annualDonation={calculatedDonation}
          allocations={allocations}
          mode={mode}
        />
      )}
    </section>
  );
}
