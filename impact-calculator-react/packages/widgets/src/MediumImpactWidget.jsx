import React, { useState } from "react";
import styles from "./MediumImpactWidget.module.css";
import { ImpactSummary } from "./ImpactSummary";
import { MediumInlineSplitSliders } from "./MediumInlineSplitSliders";
import { charities } from "./charities";

const sr = "sr-only";
export default function MediumImpactWidget({
  learnMoreUrl = "https://1fortheworld.org/impact-calculator",
}) {
  const [salary, setSalary] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");

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

  function handleAllocationChange(id, rawPct) {
    setAllocations((prev) => {
      const othersSum = Object.entries(prev)
        .filter(([key]) => key !== id)
        .reduce((sum, [, val]) => sum + val, 0);
      const clamped = Math.max(0, Math.min(rawPct, 100 - othersSum));
      return { ...prev, [id]: clamped };
    });
  }

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.leftSection}>
        <h2 className={styles.title}>Calculate your 1% impact</h2>
        <div className={styles.field}>
          <label htmlFor="salary" className={sr}>
            Annual salary (USD)
          </label>

          <input
            type="text"
            className={styles.input}
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
          salary={salaryNum}
          currentAge={currentAgeNum}
          retirementAge={retirementAgeNum}
          allocations={allocations}
          // pass any additional props you need for calculation!
        />
      </div>
    </div>
  );
}
