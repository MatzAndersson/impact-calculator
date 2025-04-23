import styles from "./Forms.module.css";

export function AnnualForm({ inputs, update }) {
  return (
    <>
      <div className={styles.formRow}>
        <select
        className={styles.selectBase}
          value={inputs.currency}
          onChange={(e) => update("currency", e.target.value)}
        >
          {["USD", "GBP", "AUD", "CAD"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
        className={styles.inputBase}
          type="number"
          value={inputs.salaryNow}
          placeholder="Annual salary"
          onChange={(e) => update("salaryNow", (e.target.value))}
        />
      </div>
    </>
  );
}
