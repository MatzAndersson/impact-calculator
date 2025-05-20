import React from "react";
import { CHARITIES } from "../data/charityData";
import styles from "./CharityCards.module.css";

export function CharityCards({
  breakdown,
  allocations,
  mode,
  onAllocationChange,
  ref,
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
    <section ref={ref} className={styles.resultsGrid}>
     

      {breakdown.map((item) => {
        // 1️⃣ pull out the static metadata once
        const charity = CHARITIES.find((c) => c.id === item.id);
        //compute this charity’s share %
        const percentage =
          mode === "equal" ? 100 / CHARITIES.length : allocations[item.id] || 0;

        return (
          <article key={item.id} className={styles.card}>
            <div className={styles.logoWrapper}>
              <img
                src={charity.logo.src}
                width={charity.logo.width}
                alt={`${charity.name} logo`}
              />
            </div>

            <h3 className={styles.cardTitle}>{charity.name}</h3>
            <p className={styles.description}>{item.shortDesc}</p>

            {mode === "custom" ? (
              <div className={styles.sliderAllocation}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percentage}
                  onChange={(e) => handleSliderChange(item.id, +e.target.value)}
                  className={styles.slider}
                />
                <div className={styles.sliderValue}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={percentage}
                    onChange={(e) =>
                      handleSliderChange(item.id, +e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                    className={styles.sliderNumberInput}
                  />
                  <span className={styles.percentageSymbol}>%</span>
                </div>
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
                <span className={styles.statLabel}>{charity.unitLabel}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {item.deaths.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className={styles.statLabel}>
                  Estimated deaths prevented
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
        ></div>
      )}
    </section>
  );
}
