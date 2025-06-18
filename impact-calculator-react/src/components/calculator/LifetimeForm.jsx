import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { decimalLimiter } from "../../utils/decimalLimiter";
import { formatWithCommas } from "../../utils/formatWithCommas";
import { Tooltip } from "react-tooltip";
import styles from "./Forms.module.css";

export function LifetimeForm({ inputs, update }) {
  const isAnnual = inputs.salaryPeriod === "annual";

  const curr = parseFloat(inputs.currentAge);
  const ret = parseFloat(inputs.retirementAge);
  const agesTouched = inputs.currentAge !== "" && inputs.retirementAge !== "";
  const ageInvalid = agesTouched && ret <= curr;

  // wait 500 ms before showing the error
  const showError = useDebounce(ageInvalid, 500);
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
      {/* ------------- Salary period toggle ------------- */}
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
      {/* salary + currency + growth rate row*/}
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="lifetimeCurrency">Currency</label>
          <select
            id="lifetimeCurrency"
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
          <label htmlFor="lifetimeSalary">
            {isAnnual ? "Annual gross salary" : "Monthly gross salary"}
          </label>
          <input
            id="lifetimeSalary"
            className={styles.inputBase}
            type="text"
            min="0"
            max={salaryMax}
            value={salaryInput}
            placeholder={isAnnual ? "e.g. 50,000" : "e.g. 4,000"}
            onChange={(e) => {
              let val = e.target.value.replace(/,/g, "");
              val = decimalLimiter(val, 2, 9); // <-- limit to 9 digits before decimal
              let num = val === "" ? 0 : +val;
              if (num !== "" && num > salaryMax) num = salaryMax;
              if (num !== "" && num < 0) num = 0;
              setSalaryInput(val);
              isAnnual
                ? update("salaryNow", num)
                : update("monthlySalary", num);
            }}
            onBlur={() => {
              setSalaryInput(formatWithCommas(salaryInput));
            }}
          />
        </div>
        <div className={`${styles.formControl} ${styles.growthControl}`}>
          <label htmlFor="growthRate">
            Salary growth rate
            <span data-tooltip-id="growthTip" className={styles.helpIcon}>
              ?
            </span>
          </label>
          <div className={styles.suffixInput}>
            <input
              id="growthRate"
              className={styles.inputBase}
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={inputs.growthRate === 0 ? "" : inputs.growthRate}
              onChange={(e) => {
                let val = decimalLimiter(e.target.value, 2); // only allow 2 decimals
                // Clamp to 0–100
                const asNum = parseFloat(val);
                if (val === "" || (asNum >= 0 && asNum <= 100)) {
                  update("growthRate", val === "" ? "" : asNum);
                }
              }}
              onKeyDown={(e) => {
                // Block e, E, +, -
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="e.g. 4%"
            />
            <span className={styles.suffix}>%</span>
          </div>
          <Tooltip
            id="growthTip"
            place="top"
            className={styles.growthTooltip}
            content={`We assume your salary will grow ~4% per year—typical long-term wage growth
    in the U.S. and much of Western Europe. If you expect faster promotions or
    higher inflation, you can bump this up; if you’re in a slower-growth job
    or region (e.g. 2–3% annual), feel free to lower it.`}
          />
        </div>
      </div>

      {/* ages row */}
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="currentAge">Current age</label>
          <input
            className={`${styles.inputBase} ${styles.ageInput}`}
            type="number"
            min="0"
            max="100"
            step="1"
            value={inputs.currentAge === 0 ? "" : inputs.currentAge}
            onChange={(e) => {
              // Allow only digits and clamp to 0–100
              const value = e.target.value.replace(/[^\d]/g, "");
              if (
                value === "" ||
                (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 100)
              ) {
                update("currentAge", value === "" ? "" : +value);
              }
            }}
            onKeyDown={(e) => {
              // Block ".", "e", "+", "-"
              if ([".", "e", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 25"
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="retirementAge">Retirement age</label>
          <input
            id="retirementAge"
            className={`${styles.inputBase} ${styles.ageInput}`}
            type="number"
            min="0"
            max="100"
            step="1"
            value={inputs.retirementAge === 0 ? "" : inputs.retirementAge}
            onChange={(e) => {
              // Allow only digits and clamp to 0–100
              const value = e.target.value.replace(/[^\d]/g, "");
              if (
                value === "" ||
                (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 120)
              ) {
                update("retirementAge", value === "" ? "" : +value);
              }
            }}
            onKeyDown={(e) => {
              if ([".", "e", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 65"
          />
          {showError && (
            <div className={styles.errorText}>
              *Retirement age must be greater than current age
            </div>
          )}
        </div>
      </div>
    </>
  );
}
