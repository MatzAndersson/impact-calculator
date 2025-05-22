import React from "react";
import { CHARITIES } from "../data/charityData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import styles from "./ImpactSummary.module.css";

const COLORS = ["#26A7FF", "#FB6A37", "#E2FF3E", "#FEDBFD"];

function TwoRowLegend({ payload }) {
  return (
    <ul className={styles.legend}>
      {payload.map((entry) => (
        <li key={entry.value}>
          <span className={styles.dot} style={{ background: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

export function ImpactSummary({
  annualDonation,
  allocations,
  mode,
  currency,
  pledgeUrl,
  conversionRate,
}) {
  const data = CHARITIES.map((c, idx) => {
    const pct =
      mode === "equal" ? 100 / CHARITIES.length : allocations[c.id] || 0;
    const moneyLocal = (annualDonation * pct) / 100;
    const localCostPerOutput = c.costPerOutputUSD * conversionRate;
    const units = Math.round(moneyLocal / localCostPerOutput);
    const localCostPerDeath = c.costPerDeathAvertedUSD * conversionRate;
    const preventedDeaths =
      localCostPerDeath > 0 ? moneyLocal / localCostPerDeath : 0;
    return {
      id: c.id,
      name: c.name,
      pct,
      moneyLocal,
      units,
      preventedDeaths,
      color: COLORS[idx % COLORS.length],
    };
  });

  const totalPreventedDeaths = data.reduce((s, d) => s + d.preventedDeaths, 0);
  const totalUnits = data.reduce((s, d) => s + d.units, 0);
  const costPerDeath =
    totalPreventedDeaths > 0 ? annualDonation / totalPreventedDeaths : 0;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading2}>Overall Impact</h2>

      <p className={styles.kpi}>
        Total estimated deaths prevented:&nbsp;
        <strong>
          {totalPreventedDeaths.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        </strong>
      </p>

      {/* Pie - donation split */}
      <h3 className={styles.subHeading}>Donation split</h3>
      <ResponsiveContainer width="100%" height={300} className={styles.chart}>
        {/* give ourselves breathing room so nothing clips */}
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            dataKey="moneyLocal"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            // turn off the default label & connector
            label={false}
            labelLine={false}
          >
            {data.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}

            {/* render our own outside % labels from the data.pct field */}
            <LabelList
              dataKey="pct"
              position="outside"
              distance={20} // push labels 20px beyond the outer radius
              formatter={(val) => (val > 0 ? `${val.toFixed(0)}%` : '')}
              fill="#333"
              stroke="#fff" // give each character a white outline
              strokeWidth={2}
              paintOrder="stroke"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                pointerEvents: "none", // labels won’t capture hover
              }}
            />
          </Pie>
          <Tooltip
            formatter={(value) =>
              value.toLocaleString(undefined, {
                style: "currency",
                currency,
                currencyDisplay: "narrowSymbol",
                maximumFractionDigits: 0,
              })
            }
          />
          <Legend content={TwoRowLegend} />
        </PieChart>
      </ResponsiveContainer>

      {/* Compact impact strip */}
      <div className={styles.kpiStrip}>
        <div>
          <strong>{totalUnits.toLocaleString()}</strong>
          <br />
          Total&nbsp;beneficiaries
        </div>
        <div>
          <strong>
            {totalPreventedDeaths.toLocaleString(undefined, {
              maximumFractionDigits: 1,
            })}
          </strong>
          <br />
          Deaths&nbsp;prevented
        </div>
        <div>
          <strong>
            {costPerDeath.toLocaleString(undefined, {
              style: "currency",
              currency,
              currencyDisplay: "narrowSymbol",
              maximumFractionDigits: 0,
            })}
          </strong>
          <br />
          Per&nbsp;death&nbsp;averted
        </div>
      </div>
      <div className={styles.ctaWrapper}>
        <a
          href={pledgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.donateButton}
        >
          <span className={styles.donateLabel}>PLEDGE</span>
          <svg
            className={styles.donateIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 5L19 12L12 19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
