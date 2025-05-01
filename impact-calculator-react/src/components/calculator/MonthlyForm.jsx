import styles from "./Forms.module.css";

export function MonthlyForm({ inputs, update }) {
  return (
    <>
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="monthlyCurrency">Currency</label>
          <select
            id="monthlyCurrency"
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
          <label htmlFor="monthlySalary">Monthly salary</label>
          <input
            id="monthlySalary"
            className={styles.inputBase}
            type="number"
            value={inputs.monthlySalary}
            min="0"
            onChange={(e) => update("monthlySalary", parseFloat(e.target.value))}
            placeholder="e.g. 3000"
          />
        </div>
      </div>
    </>
  );
}
