import React, { useState } from "react";
import styles from "./CharityCard.module.css";

export function CharityCard({
  charity, // { id, name, logo:{src,width}, unitLabel, preventedDeathsLabel }
  breakdownItem, 
  allocation, 
  mode, // "equal" | "custom"
  onAllocationChange, // (id, pct) => void
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
        {/* ─── FRONT SIDE ─── */}
        <div className={styles.cardSide}>
          <div className={styles.logoWrapper}>
            <img
              src={charity.logo.src}
              width={charity.logo.width}
              alt={`${charity.name} logo`}
            />
          </div>

          <h3 className={styles.cardTitle}>{charity.name}</h3>
          <p className={styles.description}>{breakdownItem.shortDesc}</p>

          {mode === "custom" ? (
            <div className={styles.sliderAllocation}>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={allocation}
                onChange={(e) =>
                  onAllocationChange(charity.id, +e.target.value)
                }
                className={styles.slider}
              />
              <div className={styles.sliderValue}>
                <span className={styles.percentBox}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={allocation}
                  onChange={(e) =>
                    onAllocationChange(charity.id, +e.target.value)
                  }
                  onFocus={(e) => e.target.select()}
                  className={styles.percentInput}
                  aria-label="Percentage allocation"
                />
                </span>
                <span className={styles.percentageSymbol}>%</span>
              </div>
            </div>
          ) : (
            <div className={styles.equalBadge}>
              {allocation.toFixed(0)}% of total donation
            </div>
          )}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {breakdownItem.output.toLocaleString()}
              </span>
              <span className={styles.statLabel}>{charity.unitLabel}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {breakdownItem.deaths.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className={styles.statLabel}>
                {charity.preventedDeathsLabel}
              </span>
            </div>
          </div>

          <button
            className={styles.infoButton}
            onClick={() => setFlipped(true)}
          >
            Learn more
          </button>
        </div>

        {/* ─── BACK SIDE ─── */}
        <div className={`${styles.cardSide} ${styles.cardBack}`}>
          <h3 className={styles.cardTitle}>{charity.name}</h3>
          {charity.details.map(({ heading, text }) => (
            <section key={heading} className={styles.detailSection}>
              <h4 className={styles.detailHeading}>{heading}</h4>
              <p className={styles.detailText}>{text}</p>
            </section>
          ))}
          <a
            href={charity.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.learnMore}
          >
            Learn more on GiveWell
          </a>
          <button
            className={styles.backButton}
            onClick={() => setFlipped(false)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
