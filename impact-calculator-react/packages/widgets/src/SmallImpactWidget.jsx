import React, { useState } from "react";
import useLifetimeImpact from "./hooks/useLifetimeImpact";
import { formatWithCommas } from "./utils/formatWithCommas";
import { decimalLimiter } from "./utils/decimalLimiter";
import styles from "./SmallImpactWidget.module.css";
import LogoOFTW from "./assets/OFTW-Primary-Logo-RGB-Orange-4k.svg?react";

/**
 * SmallImpactWidget
 * A simple lifetime-impact badge showing total lives saved.
 * Users input salary, current age, and retirement age (via placeholders).
 * Props:
 *  - learnMoreUrl: string (URL to full calculator, default 'https://1fortheworld.org/impact-calculator')
 */
const sr = "sr-only";
export default function SmallImpactWidget({
  learnMoreUrl = "https://1fortheworld.org/",
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
      <div className={styles.logoWrapper}>
        <a
          href="https://www.1fortheworld.org"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <LogoOFTW className={styles.logoSVG} />
        </a>
      </div>
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
          onChange={(e) => {
            let val = e.target.value.replace(/,/g, "");
            val = decimalLimiter(val, 2, 9);
            const salaryMax = 100000000;
            let num = val === "" ? 0 : +val;
            if (num > salaryMax) val = String(salaryMax);
            setSalary(val);
          }}
          onBlur={() => setSalary(formatWithCommas(salary))}
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
          step="1"
          className={styles.input}
          placeholder="e.g. 25"
          value={currentAge}
          onChange={(e) => {
            // Only allow whole numbers between 0 and 100
            const value = e.target.value.replace(/[^\d]/g, "");
            if (
              value === "" ||
              (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 100)
            ) {
              setCurrentAge(value);
            }
          }}
          onKeyDown={(e) => {
            // Block ".", "e", "+", "-"
            if ([".", "e", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}
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
          step="1"
          className={styles.input}
          placeholder="e.g. 65"
          value={retirementAge}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, "");
            if (
              value === "" ||
              (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 120)
            ) {
              setRetirementAge(value);
            }
          }}
          onKeyDown={(e) => {
            // Block ".", "e", "+", "-"
            if ([".", "e", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
      {showResult && (
        <>
          <div className={styles.value}>{livesSaved.toLocaleString()}</div>
          <div className={styles.label}>Estimated lives saved over your career</div>
        </>
      )}

      <a href={learnMoreUrl} target="_blank" className={styles.link}>
        Discover more at One for the World
      </a>
    </div>
  );
}
