import React from 'react';
import { CHARITIES } from '../data/charityData';
import styles from './CharityCards.module.css';

export function CharityCards({ annualDonation }) {
  // split donation equally among charities
  const perCharity = annualDonation / CHARITIES.length;

  return (
    <section className={styles.results}>
      {CHARITIES.map((c) => {
        const outputs = Math.floor(perCharity / c.costPerUnit);
        const deaths  = (outputs * c.deathsPerUnit).toFixed(2);

        return (
          <article key={c.id} className={styles.card}>
            <img
              src={c.logo.src}
              width={c.logo.width}
              alt={`${c.name} logo`}
            />
            <h3 className={styles.cardTitle}>{c.name}</h3>
            <p>{c.output}</p>
            <div className={styles.cardNumbers}>
              <strong>{outputs}</strong> outputs
              &nbsp;&nbsp;
              <strong className={styles.orange}>{deaths}</strong> deaths averted
            </div>
            <a className={styles.infoLink} href={`/charities/${c.id}`}>
              Info →
            </a>
          </article>
        );
      })}
    </section>
  );
}