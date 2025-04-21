import React from "react";
import { CHARITIES } from "../data/charityData";
import styles from "./CharityCards.module.css";

export function CharityCards({ annualDonation }) {
  // split donation equally among charities
  const perCharity = annualDonation / CHARITIES.length;

  return (
    <section className={styles.results}>
      {CHARITIES.map((c) => {
        const units           = Math.floor(perCharity / c.costPerUnit);
        const deathsPrevented = (units * c.deathsPerUnit).toFixed(2);

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
            <p className={styles.description}>{c.output}</p>

            {/* new two‑column stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{units}</span>
                <span className={styles.statLabel}>{c.unitName}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {deathsPrevented}
                </span>
                <span className={styles.statLabel}>
                  estimated deaths prevented
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
