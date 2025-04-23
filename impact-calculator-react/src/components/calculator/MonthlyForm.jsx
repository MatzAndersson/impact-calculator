import styles from "./Forms.module.css";

export function MonthlyForm({ inputs, update }) {
  return (
    <>
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="MonthlyCurrency">Currency</label>
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
          <label htmlFor="monthlyAmount">Monthly donation</label>
          <input
            id="monthlyAmount"
            className={styles.inputBase}
            type="number"
            value={inputs.monthlyAmount}
            min="0"
            onChange={(e) => update("monthlyAmount", e.target.value)}
            placeholder="e.g. 100"
          />
        </div>
      </div>
    </>
  );
}
