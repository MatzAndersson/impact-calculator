import { useState, useRef, useEffect, useMemo } from "react";
import { fetchEvaluations } from "../api/evaluations";
import { Tooltip } from "react-tooltip";
import useCalculatorInputs from "../hooks/useCalculatorInputs";
import { EmailGate } from "../components/email-gate/EmailGate";
import { InputTabs } from "../components/calculator/InputTabs";
import { AnnualForm } from "../components/calculator/AnnualForm";

import { LifetimeForm } from "../components/calculator/LifetimeForm";
import { CharityCardGrid } from "../components/cards/CharityCardGrid";
import { InlineSplitSliders } from "../components/InlineSplitSliders";
import { TotalAllocationIndicator } from "../components/TotalAllocationIndicator";
import { CHARITIES } from "../data/charityData";
import { ImpactSummary } from "../components/ImpactSummary";

import pageStyles from "./ImpactCalculatorPage.module.css";

function getPledgeUrl(currency) {
  const base = "https://1fortheworld.donational.org/take-the-pledge";
  return currency === "USD" ? base : `${base}-${currency.toLowerCase()}`;
}

const FORM_ID = "1FAIpQLSc0CJ_l39-agUbTZOJhiWJRDi_RkOm19qa69wveXtgYIdTWEA";
const ENTRY_KEY = "entry.1634121982";

export default function ImpactCalculatorPage() {
  const summaryRef = useRef(null);
  const cardsRef = useRef();
  const { inputs, update, resetAll } = useCalculatorInputs();
  const [calculatedDonation, setCalculatedDonation] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  const [conversionRate, setConversionRate] = useState(1);
  const [email, setEmail] = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gatedEmail");
    if (saved) {
      setEmail(saved);
      handleCalculate();
      setShowResults(true);
    }
  }, []);

  const [mode, setMode] = useState("equal");
  const [allocations, setAllocations] = useState(() =>
    CHARITIES.reduce(
      (acc, c) => ({ ...acc, [c.id]: 100 / CHARITIES.length }),
      {}
    )
  );
  const totalPercentage = useMemo(
    () => Object.values(allocations).reduce((sum, pct) => sum + pct, 0),
    [allocations]
  );

  function handleAllocationChange(id, rawPct) {
    setAllocations((prev) => {
      // 1) sum of everybody except the one we’re changing:
      const othersSum = Object.entries(prev)
        .filter(([key]) => key !== id)
        .reduce((sum, [, val]) => sum + val, 0);

      // 2) clamp rawPct to [0, 100 - othersSum]
      const clamped = Math.max(0, Math.min(rawPct, 100 - othersSum));

      return { ...prev, [id]: clamped };
    });
  }

  useEffect(() => {
    const abbrevs = CHARITIES.map((c) => c.id);
    let isMounted = true;
    async function loadEvaluationsAndRate() {
      try {
        // 1) fetch the API data
        const evs = await fetchEvaluations(abbrevs, inputs.currency);
        if (!isMounted) return;

        // 2) store the raw evaluations
        setEvaluations(evs);

        // 3) derive USD→local conversion from the first charity
        if (evs.length > 0) {
          const sample = evs[0];
          const centsPerUnit = sample.cents_per_output; // e.g. 500 (cents)
          const localPerUnit = sample.converted_cost_per_output; // e.g. 400 (local)
          const rate = localPerUnit / (centsPerUnit / 100);
          setConversionRate(rate);
        }
      } catch (err) {
        console.error("API failed:", err);
        if (!isMounted) return;
        setEvaluations([]);
        setConversionRate(1); // fallback to 1:1
      }
    }

    loadEvaluationsAndRate();

    return () => {
      isMounted = false;
    };
  }, [inputs.currency]);

  const handleCalculate = () => {
    let donation = 0;

    if (inputs.mode === "annual") {
      let annualSalary = 0;
      if (inputs.salaryPeriod === "annual") {
        annualSalary = parseFloat(inputs.salaryNow) || 0;
      } else {
        annualSalary = (parseFloat(inputs.monthlySalary) || 0) * 12;
      }
      donation = annualSalary * (inputs.pledgePercent || 0.01);
    } else if (inputs.mode === "monthly") {
      donation =
        (parseFloat(inputs.monthlySalary) || 0) *
        12 *
        (inputs.pledgePercent || 0.01);
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

  const handleGateSuccess = (userEmail) => {
    setEmail(userEmail);
    setShowGate(false);
    handleCalculate(); // recompute with current inputs
    setShowResults(true); // now show the summary/cards
  };

  const handleCalculateClick = () => {
    if (!email) {
      setShowGate(true);
    } else {
      // they already passed the gate
      handleCalculate();
      //todo: window.dataLayer.push({ event: 'calculate_clicked' });
      setShowResults(true);
    }
  };

  const formatCurrency = (value) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: inputs.currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  // 1) Calculate all three donation amounts
  let annualSalary = 0,
    monthlySalary = 0;

  if (inputs.mode === "annual") {
    if (inputs.salaryPeriod === "annual") {
      annualSalary = parseFloat(inputs.salaryNow) || 0;
      monthlySalary = annualSalary / 12;
    } else {
      monthlySalary = parseFloat(inputs.monthlySalary) || 0;
      annualSalary = monthlySalary * 12;
    }
  } else if (inputs.mode === "monthly") {
    monthlySalary = parseFloat(inputs.monthlySalary) || 0;
    annualSalary = monthlySalary * 12;
  }

  const annualBase =
    inputs.salaryPeriod === "annual"
      ? parseFloat(inputs.salaryNow) || 0
      : (parseFloat(inputs.monthlySalary) || 0) * 12;

  const annualDonation = annualSalary * (inputs.pledgePercent || 0.01);
  const monthlyDonation = monthlySalary * (inputs.pledgePercent || 0.01);

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
    (inputs.mode === "annual" &&
      ((inputs.salaryPeriod === "annual" && parseFloat(inputs.salaryNow) > 0) ||
        (inputs.salaryPeriod === "monthly" &&
          parseFloat(inputs.monthlySalary) > 0))) ||
    (inputs.mode === "monthly" && parseFloat(inputs.monthlySalary) > 0) ||
    (inputs.mode === "lifetime" &&
      lifetimeBaseSalary > 0 &&
      parseFloat(inputs.currentAge) > 0 &&
      parseFloat(inputs.retirementAge) > 0 &&
      parseFloat(inputs.retirementAge) > parseFloat(inputs.currentAge) &&
      parseFloat(inputs.growthRate) > 0);

  // Rebuild the per-charity breakdown whenever donation or evaluation data changes
  const breakdown = useMemo(() => {
    if (!evaluations.length || calculatedDonation <= 0) return [];

    return evaluations.map((ev) => {
      const id = ev.charity.abbreviation;

      const pct = (allocations[id] || 0) / 100;
      const amount = calculatedDonation * pct;

      const costPerOutput = ev.converted_cost_per_output; // from API

      const usdCostPerDeath = CHARITIES.find(
        (c) => c.id === id
      ).costPerDeathAvertedUSD;
      const localCostPerDeath = usdCostPerDeath * conversionRate;

      return {
        id,
        name: ev.charity.charity_name,
        output: Math.round(amount / costPerOutput),
        deaths:
          localCostPerDeath > 0 ? +(amount / localCostPerDeath).toFixed(2) : 0,
        shortDesc: ev.intervention.short_description,
        longDesc: ev.intervention.long_description,
      };
    });
  }, [evaluations, calculatedDonation, allocations, conversionRate]);

  return (
    <>
      {showGate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <EmailGate
            formId={FORM_ID}
            entryKey={ENTRY_KEY}
            onSuccess={handleGateSuccess}
          />
        </div>
      )}

      <section className={pageStyles.icWrapper}>
        <div className={pageStyles.icPanel}>
          <InputTabs
            value={inputs.mode}
            onChange={(val) => update("mode", val)}
          >
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
                  /* requestAnimationFrame(() => {
                    cardsRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  });*/
                }}
              />{" "}
              Customize split (set your own percentages below)
            </label>
          </fieldset>

          <InlineSplitSliders
            charities={CHARITIES}
            allocations={allocations}
            onAllocationChange={handleAllocationChange}
            isOpen={mode === "custom"}
          />
          {mode === "custom" && (
            <TotalAllocationIndicator total={totalPercentage} />
          )}

          {/* ---------- slider OR monthly preview ---------- */}

          <div className={pageStyles.rangeWrapper}>
            <span className={pageStyles.rangeLabel}>
              I’d like to donate&nbsp;
              <input
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                value={(inputs.pledgePercent * 100).toFixed(1)}
                onChange={(e) =>
                  update("pledgePercent", Number(e.target.value) / 100)
                }
                onFocus={(e) => e.target.select()}
                className={pageStyles.sliderNumberInput}
              />
              <span className={pageStyles.percentageSymbol}>%</span>
            </span>

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
              className={pageStyles.slider}
            />
          </div>

          {/* live preview, always shown */}
          <div className={pageStyles.annualDonation}>
            {inputs.mode === "annual" && (
              <>
                Annual donation: {formatCurrency(annualDonation)}
                <br />
                Monthly donation: {formatCurrency(monthlyDonation)}
              </>
            )}

            {inputs.mode === "monthly" && (
              <>
                Monthly donation: {formatCurrency(monthlyDonation)}
                <br />
                Annual donation: {formatCurrency(annualDonation)}
              </>
            )}

            {inputs.mode === "lifetime" && (
              <>
                Lifetime donation: {formatCurrency(lifetimeDonation)}
                <br />
                Over {lifetimeYears} year{lifetimeYears !== 1 && "s"}
              </>
            )}
          </div>
          <div className={pageStyles.buttonsRow}></div>

          <span
            data-tooltip-id="calculateTip"
            data-tooltip-content="Please fill in all required fields and/or allocate 100% of the donation"
          >
            <button
              className={pageStyles.calculateBtn}
              onClick={handleCalculateClick}
              disabled={
                !salaryFilled || (mode === "custom" && totalPercentage !== 100)
              }
            >
              Calculate donation
            </button>
          </span>
          {(!salaryFilled ||
            (mode === "custom" && totalPercentage !== 100)) && (
            <Tooltip id="calculateTip" place="top" className="growthTooltip" />
          )}
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

        {showResults && (
          <>
            <div ref={summaryRef}>
              <ImpactSummary
                annualDonation={calculatedDonation}
                conversionRate={conversionRate}
                allocations={allocations}
                mode={mode}
                currency={inputs.currency}
                pledgeUrl={getPledgeUrl(inputs.currency)}
              />
            </div>
            {mode === "custom" && (
              <TotalAllocationIndicator total={totalPercentage} />
            )}
            <CharityCardGrid
              ref={cardsRef}
              breakdown={breakdown}
              allocations={allocations}
              mode={mode}
              onAllocationChange={handleAllocationChange}
            />
          </>
        )}
      </section>
    </>
  );
}
