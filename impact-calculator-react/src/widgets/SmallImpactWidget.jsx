import React, { useState } from "react";
import useLifetimeImpact from "../hooks/useLifetimeImpact";
import styles from "./SmallImpactWidget.module.css";

/**
 * SmallImpactWidget
 * A simple lifetime-impact badge showing total lives saved.
 * Users input salary, current age, and retirement age (via placeholders).
 * Props:
 *  - learnMoreUrl: string (URL to full calculator, default 'https://1fortheworld.org/impact-calculator')
 */
const sr = "sr-only";
export default function SmallImpactWidget({
  learnMoreUrl = "https://1fortheworld.org/impact-calculator",
}) {
  const [salary, setSalary] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");

  // Parse numeric values or fall back to 0
  const salaryNum = parseFloat(salary.replace(/[^0-9.]/g, "")) || 0;
  const currentAgeNum = parseInt(currentAge, 10) || 0;
  const retirementAgeNum = parseInt(retirementAge, 10) || 0;

  // Calculate results using lifetime inputs
  const { livesSaved } = useLifetimeImpact({
    salaryNow: salaryNum,
    pledgePercent: 0.01, // 1 %
    growthRate: 0.04, // 4 %
    currentAge: currentAgeNum,
    retirementAge: retirementAgeNum,
  });

  // Only show result once all fields are filled
  const showResult =
    salaryNum > 0 && currentAgeNum > 0 && retirementAgeNum > currentAgeNum;

  return (
    <div className={styles.widgetBadge}>
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
              salary.replace(/[^\d]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
      {showResult && (
        <>
          <div className={styles.value}>{livesSaved.toLocaleString()}</div>
          <div className={styles.label}>Lives saved over your career</div>
        </>
      )}

      <a href={learnMoreUrl} className={styles.link}>
        Learn more about your impact
      </a>
    </div>
  );
}
