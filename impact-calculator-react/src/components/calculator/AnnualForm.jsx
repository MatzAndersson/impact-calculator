import styles from "./Forms.module.css";

export function AnnualForm({ inputs, update }) {
  return (
    <>
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
          <label htmlFor="annualSalary">Annual gross salary</label>
          <input
            id="annualSalary"
            className={styles.inputBase}
            type="number"
            value={inputs.salaryNow}
            placeholder="e.g. 50,000"
            onChange={(e) => update("salaryNow", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
