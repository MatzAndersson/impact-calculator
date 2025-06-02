import React, { useState, useEffect } from "react";
import styles from "./MediumImpactWidget.module.css";
import { ImpactSummary } from "./ImpactSummary";
import { MediumInlineSplitSliders } from "./MediumInlineSplitSliders";
import { fetchEvaluations } from "./api/Evaluations";
import { charities } from "./charities";

const sr = "sr-only";
export default function MediumImpactWidget({
  learnMoreUrl = "https://1fortheworld.org/impact-calculator",
}) {
  const [salary, setSalary] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [conversionRate, setConversionRate] = useState(1);
  const [currency, setCurrency] = useState("USD");

  // Parse numeric values or fall back to 0
  const salaryNum = parseFloat(salary.replace(/[^0-9.]/g, "")) || 0;
  const currentAgeNum = parseInt(currentAge, 10) || 0;
  const retirementAgeNum = parseInt(retirementAge, 10) || 0;

  // Only show result once all fields are filled
  const [mode, setMode] = useState("equal");
  const [allocations, setAllocations] = useState({
    mc: 25,
    amf: 25,
    ni: 25,
    hki: 25,
  });
  const totalPercentage = Object.values(allocations).reduce(
    (sum, pct) => sum + pct,
    0
  );

  const [annualDonation, setAnnualDonation] = useState(0);

  useEffect(() => {
    if (
      salaryNum > 0 &&
      currentAgeNum > 0 &&
      retirementAgeNum > currentAgeNum
    ) {
      setAnnualDonation(salaryNum * 0.01); // 1% for example
    } else {
      setAnnualDonation(0);
    }
  }, [salaryNum, currentAgeNum, retirementAgeNum]);

  function handleAllocationChange(id, rawPct) {
    setAllocations((prev) => {
      const othersSum = Object.entries(prev)
        .filter(([key]) => key !== id)
        .reduce((sum, [, val]) => sum + val, 0);
      const clamped = Math.max(0, Math.min(rawPct, 100 - othersSum));
      return { ...prev, [id]: clamped };
    });
  }

  useEffect(() => {
    const abbrevs = charities.map((c) => c.id);
    let isMounted = true;
    async function loadEvaluationsAndRate() {
      try {
        // 1) fetch the API data
        const evs = await fetchEvaluations(abbrevs, currency);
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
  }, [currency]);

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.leftSection}>
        <h2 className={styles.title}>Calculate your 1% impact</h2>
        <div className={styles.field}>
          <div className={styles.inputPairWrapper}>
            <div className={styles.rowLabels}>
              <label htmlFor="currency">Currency</label>
              <label htmlFor="salary" style={{ marginLeft: "12px" }}>
                Annual salary
              </label>
            </div>
            <div className={styles.inputRow}>
              <select
                id="currency"
                className={styles.currencySelect}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="text"
                className={styles.salaryInput}
                id="salary"
                min="0"
                step="1000"
                placeholder="e.g. 50,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                onBlur={() =>
                  setSalary(
                    salary
                      .replace(/[^\d]/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="age-now" className={sr}>
            Current age
          </label>
          <input
            id="age-now"
            type="number"
            min="0"
            max="100"
            className={styles.input}
            placeholder="e.g. 25"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="age-retire" className={sr}>
            Retirement age
          </label>
          <input
            id="age-retire"
            type="number"
            min="0"
            max="100"
            className={styles.input}
            placeholder="e.g. 65"
            value={retirementAge}
            onChange={(e) => setRetirementAge(e.target.value)}
          />
        </div>
        <fieldset className={styles.allocationToggle}>
          <legend>How should we split your donation?</legend>
          <label>
            <input
              type="radio"
              checked={mode === "equal"}
              onChange={() => {
                setMode("equal");
                setAllocations({ mc: 25, amf: 25, ni: 25, hki: 25 });
              }}
            />
            Split equally (25% each)
          </label>
          <label>
            <input
              type="radio"
              checked={mode === "custom"}
              onChange={() => setMode("custom")}
            />
            Customize split
          </label>
        </fieldset>

        {mode === "custom" && (
          <>
            <MediumInlineSplitSliders
              charities={charities}
              allocations={allocations}
              onAllocationChange={handleAllocationChange}
              isOpen={true}
            />
            <div>
              Total allocation: {totalPercentage}%
              {totalPercentage !== 100 && (
                <span style={{ color: "red" }}> (must be 100%)</span>
              )}
            </div>
          </>
        )}

        <a href={learnMoreUrl} className={styles.link}>
          Learn more about your impact
        </a>
      </div>
      <div className={styles.rightSection}>
        <ImpactSummary
          mode={mode}
          annualDonation={annualDonation}
          currency={currency}
          conversionRate={conversionRate}
          salary={salaryNum}
          currentAge={currentAgeNum}
          retirementAge={retirementAgeNum}
          allocations={allocations}
            evaluations={evaluations}
        />
      </div>
    </div>
  );
}
