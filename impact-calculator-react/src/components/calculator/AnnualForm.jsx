import React, { useState, useEffect } from "react";
import { decimalLimiter } from "../../utils/decimalLimiter";
import { formatWithCommas } from "../../utils/formatWithCommas";
import styles from "./Forms.module.css";

export function AnnualForm({ inputs, update }) {
  const isAnnual = inputs.salaryPeriod === "annual";
  const salaryMax = 100000000; // max salary for annual or monthly

  const [salaryInput, setSalaryInput] = useState("");

  // Keep salaryInput in sync when toggling between annual/monthly or when external changes happen
  useEffect(() => {
    const val = isAnnual ? inputs.salaryNow : inputs.monthlySalary;
    setSalaryInput(val ? formatWithCommas(val) : "");
    // eslint-disable-next-line
  }, [isAnnual, inputs.salaryNow, inputs.monthlySalary]);
  return (
    <>
      <div className={styles.tabHelper}>
        See your impact over <strong>1 year</strong>
      </div>
      <div className={styles.formRow}>
        <div className={`${styles.formControl} ${styles.periodToggle}`}>
          <label className={styles.radioInline}>
            <input
              type="radio"
              name="salaryPeriod"
              value="annual"
              checked={isAnnual}
              onChange={() => update("salaryPeriod", "annual")}
            />
            Annual salary
          </label>
          <label className={styles.radioInline} style={{ marginLeft: "12px" }}>
            <input
              type="radio"
              name="salaryPeriod"
              value="monthly"
              checked={!isAnnual}
              onChange={() => update("salaryPeriod", "monthly")}
            />
            Monthly salary
          </label>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="annualCurrency">Currency</label>
          <select
            id="annualCurrency"
            className={styles.selectBase}
            value={inputs.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            {["USD", "GBP", "AUD", "CAD"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.formControl}>
          <label htmlFor="annualSalary">
            {isAnnual ? "Annual gross salary" : "Monthly gross salary"}
          </label>
          <input
            id="annualSalary"
            className={styles.inputBase}
            type="text"
            inputMode="decimal"
            min="0"
            max={salaryMax}
            value={salaryInput}
            placeholder={isAnnual ? "e.g. 50,000" : "e.g. 4,000"}
            onChange={(e) => {
              let val = e.target.value.replace(/,/g, "");
              val = decimalLimiter(val, 2, 9); // 2 decimals, 9 integer digits
              let num = val === "" ? 0 : +val;
              if (num !== "" && num > salaryMax) num = salaryMax;
              if (num !== "" && num < 0) num = 0;
              setSalaryInput(val);
              isAnnual
                ? update("salaryNow", num)
                : update("monthlySalary", num);
            }}
            onBlur={() => setSalaryInput(formatWithCommas(salaryInput))}
          />
        </div>
      </div>
    </>
  );
}
