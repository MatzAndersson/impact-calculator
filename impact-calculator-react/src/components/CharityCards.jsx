import React from 'react';
import { CHARITIES } from '../data/charityData';

export function CharityCards({ annualDonation }) {
  // split donation equally among charities
  const perCharity = annualDonation / CHARITIES.length;

  return (
    <section className="results">
      {CHARITIES.map((c) => {
        const outputs = Math.floor(perCharity / c.costPerUnit);
        const deaths  = (outputs * c.deathsPerUnit).toFixed(2);

        return (
          <article key={c.id} className="charity-card">
            <img
              src={c.logo.src}
              width={c.logo.width}
              alt={`${c.name} logo`}
            />
            <h3>{c.name}</h3>
            <p>{c.output}</p>
            <div className="charity-card__numbers">
              <strong>{outputs}</strong> outputs
              &nbsp;&nbsp;
              <strong className="orange">{deaths}</strong> deaths averted
            </div>
            <a className="info-link" href={`/charities/${c.id}`}>
              Info →
            </a>
          </article>
        );
      })}
    </section>
  );
}