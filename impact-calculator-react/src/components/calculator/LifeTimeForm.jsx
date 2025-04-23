import styles from './Forms.module.css';

export function LifetimeForm({ inputs, update }) {
  return (
    <>
      {/* salary + currency row */}
      <div className={styles.formRow}>
        <select
          className={styles.selectBase}
          value={inputs.currency}
          onChange={(e) => update('currency', e.target.value)}
        >
          {['USD','GBP','AUD','CAD'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          className={styles.inputBase}
          type="number"
          value={inputs.salaryNow}
          onChange={(e) => update('salaryNow', (e.target.value))}
        />
      </div>

      {/* ages row */}
      <div className={styles.formRow}>
        <input
          className={styles.inputBase}
          type="number"
          value={inputs.currentAge}
          onChange={(e) => update('currentAge', (e.target.value))}
          placeholder="Current age"
        />
        <input
          className={styles.inputBase}
          type="number"
          value={inputs.retirementAge}
          onChange={(e) => update('retirementAge', (e.target.value))}
          placeholder="Retirement age"
        />
      </div>

      {/* growth rate row */}
      <div className={styles.formRow}>
        <input
          className={styles.inputBase}
          type="number"
          step="0.01"
          value={inputs.growthRate}
          onChange={(e) => update('growthRate', Number(e.target.value))}
          placeholder="Salary growth rate (e.g. 0.04)"
        />
      </div>
    </>
  );
}

