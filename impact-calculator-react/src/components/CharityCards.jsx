import React from "react";
import { CHARITIES } from "../data/charityData";
import styles from "./CharityCards.module.css";

export const CharityCards = React.forwardRef(function CharityCards(
  { breakdown, allocations, mode, onAllocationChange },
  ref
) {
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
    <section ref={ref} className={styles.resultsGrid}>
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

      {/* Loop over the computed breakdown data */}
      {breakdown.map((item) => {
        // Static info from CHARITIES (logo, labels)
        const staticData = CHARITIES.find((c) => c.id === item.id);

        const percentage =
          mode === "equal"
            ? 100 / breakdown.length // total charities
            : allocations[item.id] || 0;

        return (
          <article key={item.id} className={styles.card}>
            <div className={styles.logoWrapper}>
              <img
                src={staticData.logo.src}
                width={staticData.logo.width}
                alt={`${staticData.name} logo`}
              />
            </div>

            {/* title + description */}
            <h3 className={styles.cardTitle}>{staticData.name}</h3>
            <p className={styles.description}>{staticData.outputDescription}</p>

            {mode === "custom" ? (
              <div className={styles.sliderAllocation}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percentage}
                  onChange={(e) =>
                    handleSliderChange(item.id, Number(e.target.value))
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
                <span className={styles.statNumber}>
                  {item.output.toLocaleString()}
                </span>
                <span className={styles.statLabel}>{staticData.unitLabel}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {item.deaths.toLocaleString()}
                </span>
                <span className={styles.statLabel}>
                  {staticData.preventedDeathsLabel}
                </span>
              </div>
            </div>
            <button
              className={styles.infoButton}
              onClick={() => (window.location.href = `/charities/${item.id}`)}
            >
              Info →
            </button>
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
          
        </div>
      )}
    </section>
  );
});
