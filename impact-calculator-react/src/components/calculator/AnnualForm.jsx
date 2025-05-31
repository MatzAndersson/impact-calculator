import styles from "./Forms.module.css";

export function AnnualForm({ inputs, update }) {
  const isAnnual = inputs.salaryPeriod === "annual";
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
            type="number"
            min="0"
            value={
              isAnnual
                ? inputs.salaryNow === 0 || inputs.salaryNow === ""
                  ? ""
                  : inputs.salaryNow
                : inputs.monthlySalary === 0 || inputs.monthlySalary === ""
                ? ""
                : inputs.monthlySalary
            }
            placeholder={isAnnual ? "e.g. 50,000" : "e.g. 4,000"}
            onChange={(e) =>
              isAnnual
                ? update(
                    "salaryNow",
                    e.target.value === "" ? "" : +e.target.value
                  )
                : update(
                    "monthlySalary",
                    e.target.value === "" ? "" : +e.target.value
                  )
            }
          />
        </div>
      </div>
    </>
  );
}
