import React from "react";
import { CHARITIES } from "../data/charityData";
import styles from "./CharityCards.module.css";

export function CharityCards({
  annualDonation,
  allocations,
  mode,
  onAllocationChange,
}) {
  const totalPercentage = Object.values(allocations).reduce(
    (sum, percentage) => sum + percentage,
    0
  );

  const handleSliderChange = (id, newPct) => {
    const remainingPercentage = 100 - (totalPercentage - allocations[id]);
    const adjustedPercentage = Math.min(newPct, remainingPercentage);
    onAllocationChange(id, adjustedPercentage);
  };

  return (
    <section className={styles.resultsGrid}>
      {mode === "custom" && (
        <div
          className={`${styles.totalPctIndicator} ${
            totalPercentage === 100 ? styles.validTotal : styles.invalidTotal
          }`}
          style={{ gridColumn: "1 / -1" }} /* still spans full row */
        >
          Total allocation: {totalPercentage}%{" "}
          {totalPercentage !== 100 && "← adjust to 100 %"}
        </div>
      )}
      {CHARITIES.map((c) => {
        // Determine the percentage allocation
        const percentage =
          mode === "equal" ? 100 / CHARITIES.length : allocations[c.id] || 0;
        const money = annualDonation * (percentage / 100);
        const units = Math.round(money / c.costPerOutputUSD);
        const deathsPrevented = (money / c.costPerDeathAvertedUSD).toFixed(2);

        return (
          <article key={c.id} className={styles.card}>
            <img src={c.logo.src} width={c.logo.width} alt={`${c.name} logo`} />

            <button
              className={styles.infoButton}
              onClick={() => (window.location.href = `/charities/${c.id}`)}
            >
              Info →
            </button>

            {/* title + description */}
            <h3 className={styles.cardTitle}>{c.name}</h3>
            <p className={styles.description}>{c.description}</p>

            {mode === "custom" ? (
              <div className={styles.sliderAllocation}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percentage}
                  onChange={(e) =>
                    handleSliderChange(c.id, Number(e.target.value))
                  }
                  className={styles.slider}
                />
                <span className={styles.sliderLabel}>{percentage}%</span>
              </div>
            ) : (
              <div className={styles.equalBadge}>
                {percentage.toFixed(0)}% of total donation
              </div>
            )}
            {/* new two‑column stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{units}</span>
                <span className={styles.statLabel}>{c.unitLabel}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{deathsPrevented}</span>
                <span className={styles.statLabel}>
                  {c.preventedDeathsLabel}
                </span>
              </div>
            </div>
          </article>
        );
      })}
      {mode === "custom" && (
        <div
          className={`${styles.totalPctIndicator} ${
            totalPercentage === 100 ? styles.validTotal : styles.invalidTotal
          }`}
          style={{ gridColumn: "1 / -1" }} /* still spans full row */
        >
          Total allocation: {totalPercentage}%{" "}
          {totalPercentage !== 100 && "← adjust to 100 %"}
        </div>
      )}
    </section>
  );
}
