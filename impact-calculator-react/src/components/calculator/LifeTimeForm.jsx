import styles from "./Forms.module.css";

export function LifetimeForm({ inputs, update }) {
  return (
    <>
      {/* salary + currency row */}
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
          <label htmlFor="lifetimeSalary">Annual salary</label>
          <input
            id="lifetimeSalary"
            className={styles.inputBase}
            type="number"
            value={inputs.salaryNow}
            placeholder="e.g. 50000"
            onChange={(e) => update("salaryNow", e.target.value)}
          />
        </div>
      </div>

      {/* ages row */}
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="currentAge">Current age</label>
          <input
            className={styles.inputBase}
            type="number"
            value={inputs.currentAge}
            onChange={(e) => update("currentAge", e.target.value)}
            placeholder="e.g. 25"
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="retirementAge">Retirement age</label>
          <input
            id="retirementAge"
            className={styles.inputBase}
            type="number"
            value={inputs.retirementAge}
            onChange={(e) => update("retirementAge", e.target.value)}
            placeholder="e.g. 65"
          />
        </div>
      </div>

      {/* growth rate row */}
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="growthRate">Salary growth rate in percentage</label>
          <div className={styles.suffixInput}>
            <input
              id="growthRate"
              className={styles.inputBase}
              type="number"
              step="0.01"
              value={inputs.growthRate}
              onChange={(e) => update("growthRate", e.target.value)}
              placeholder="e.g. 4%"
            />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
      </div>
    </>
  );
}
