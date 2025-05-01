import { useState, useRef } from "react";
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
  const cardsRef = useRef(null);
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
      // monthlySalary is already the user's input per month
      donation = inputs.monthlySalary * 12 * inputs.pledgePercent;
    } else if (inputs.mode === "lifetime") {
      const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
      const r = Math.max(0.000001, inputs.growthRate / 100);
      const earned = (inputs.salaryNow * ((1 + r) ** years - 1)) / r;
      donation = earned * inputs.pledgePercent;
    }

    setCalculatedDonation(donation);

    requestAnimationFrame(() => {
      cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const fmt = (value) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: inputs.currency,
      maximumFractionDigits: 0,
    });

  // 1) Calculate all three donation amounts
  const annualDonation =
    inputs.mode === "monthly"
      ? inputs.monthlySalary * 12 * inputs.pledgePercent
      : inputs.salaryNow * inputs.pledgePercent;

  const monthlyDonation =
    inputs.mode === "monthly"
      ? inputs.monthlySalary * inputs.pledgePercent
      : annualDonation / 12; // ← this is what you display in Annual tab
  const lifetimeDonation = (() => {
    const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
    const r = Math.max(0.000001, inputs.growthRate / 100);
    return (
      ((inputs.salaryNow * ((1 + r) ** years - 1)) / r) * inputs.pledgePercent
    );
  })();

  const salaryFilled =
    (inputs.mode === "annual" && inputs.salaryNow > 0) ||
    (inputs.mode === "monthly" && inputs.monthlySalary > 0) ||
    (inputs.mode === "lifetime" &&
      inputs.salaryNow > 0 &&
      inputs.currentAge > 0 &&
      inputs.retirementAge > inputs.currentAge &&
      inputs.growthRate > 0);

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
            How should we split your donation across the 4 top charities?
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
            Customize split (set your own percentages below)
          </label>
        </fieldset>

        {/* ---------- slider OR monthly preview ---------- */}

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

        {/* live preview, always shown */}
        <div className={pageStyles.annualDonation}>
          {inputs.mode === "annual" && (
            <>
              Annual donation: {fmt(annualDonation)}
              <br />
              Monthly donation: {fmt(monthlyDonation)}
            </>
          )}

          {inputs.mode === "monthly" && (
            <>
              Monthly donation: {fmt(monthlyDonation)}
              <br />
              Annual donation: {fmt(annualDonation)}
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
        <div
          className={pageStyles.tipWrapper}
          data-tip={!salaryFilled ? "Please fill in all required fields" : ""}
        >
          <button
            className={pageStyles.calculateBtn}
            onClick={handleCalculate}
            disabled={!salaryFilled}
          >
            Calculate donation
          </button>
        </div>
      </div>

      <>
        <CharityCards
          ref={cardsRef}
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
