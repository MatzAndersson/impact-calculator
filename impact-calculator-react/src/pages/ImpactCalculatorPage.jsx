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

function getPledgeUrl(currency) {
  const base = "https://1fortheworld.donational.org/take-the-pledge";
  return currency === "USD" ? base : `${base}-${currency.toLowerCase()}`;
}

export default function ImpactCalculatorPage() {
  const summaryRef = useRef(null);
  const cardsRef = useRef(null);
  const { inputs, update, resetAll } = useCalculatorInputs();
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
      const annualBase =
        inputs.salaryPeriod === "annual"
          ? inputs.salaryNow
          : inputs.monthlySalary * 12; // convert monthly → annual

      const years = Math.max(0, inputs.retirementAge - inputs.currentAge);
      const r = Math.max(0.000001, inputs.growthRate / 100);
      const earned = (annualBase * ((1 + r) ** years - 1)) / r;
      donation = earned * inputs.pledgePercent;
    }

    setCalculatedDonation(donation);

    requestAnimationFrame(() => {
      summaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const fmt = (value) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: inputs.currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  // 1) Calculate all three donation amounts
  const annualBase =
    inputs.salaryPeriod === "annual"
      ? parseFloat(inputs.salaryNow) || 0
      : (parseFloat(inputs.monthlySalary) || 0) * 12;

  const annualDonation = annualBase * inputs.pledgePercent;
  const monthlyDonation = annualDonation / 12;

  // figure out how many years – at least 1
  const currAge = parseFloat(inputs.currentAge);
  const retAge = parseFloat(inputs.retirementAge);
  const lifetimeYears =
    !isNaN(currAge) && !isNaN(retAge) && retAge > currAge
      ? retAge - currAge
      : 0;

  // do the standard compound‐growth lifetime formula
  const r = Math.max(0.000001, inputs.growthRate / 100);
  const lifetimeDonation =
    ((annualBase * (Math.pow(1 + r, lifetimeYears) - 1)) / r) *
    inputs.pledgePercent;

  const lifetimeBaseSalary =
    inputs.salaryPeriod === "annual"
      ? parseFloat(inputs.salaryNow)
      : parseFloat(inputs.monthlySalary);

  const salaryFilled =
    (inputs.mode === "annual" && parseFloat(inputs.salaryNow) > 0) ||
    (inputs.mode === "monthly" && parseFloat(inputs.monthlySalary) > 0) ||
    (inputs.mode === "lifetime" &&
      /* salary field that matches the toggle */
      lifetimeBaseSalary > 0 &&
      /* both ages present and retirement > current */
      parseFloat(inputs.currentAge) > 0 &&
      parseFloat(inputs.retirementAge) > 0 &&
      parseFloat(inputs.retirementAge) > parseFloat(inputs.currentAge) &&
      parseFloat(inputs.growthRate) > 0);

  return (
    <section className={pageStyles.icWrapper}>
      <div className={pageStyles.icPanel}>
        <InputTabs value={inputs.mode} onChange={(val) => update("mode", val)}>
          <LifetimeForm
            value="lifetime"
            label="Lifetime"
            inputs={inputs}
            update={update}
          />
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
              onChange={() => {
                setMode("custom");
                setAllocations(
                  CHARITIES.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
                );
                requestAnimationFrame(() => {
                  cardsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                });
              }}
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
              Over {lifetimeYears} year{lifetimeYears !== 1 && "s"}
            </>
          )}
        </div>
        <div className={pageStyles.buttonsRow}></div>
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

        <button
          className={pageStyles.resetBtn}
          onClick={() => {
            resetAll(); // clear form state
            update("mode", inputs.mode);
            setCalculatedDonation(0); // hide results
            setMode("equal"); // back to 25 % each
            setAllocations(
              CHARITIES.reduce(
                (acc, c) => ({ ...acc, [c.id]: 100 / CHARITIES.length }),
                {}
              )
            );
            window.scrollTo({ top: 0, behavior: "smooth" }); // back to top
          }}
        >
          Reset
        </button>
      </div>

      <>
        <div ref={summaryRef}>
          <ImpactSummary
            annualDonation={calculatedDonation}
            allocations={allocations}
            mode={mode}
            currency={inputs.currency}
            pledgeUrl={getPledgeUrl(inputs.currency)}
          />
        </div>

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
    </section>
  );
}
