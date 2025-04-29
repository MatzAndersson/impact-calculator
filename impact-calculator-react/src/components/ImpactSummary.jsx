import React from "react";
import { CHARITIES } from "../data/charityData";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./ImpactSummary.module.css";

const COLORS = ["#26A7FF", "#FB6A37", "#E2FF3E", "#FEDBFD"];

export function ImpactSummary({ annualDonation, allocations, mode }) {
  const data = CHARITIES.map((c, idx) => {
    const pct =
      mode === "equal" ? 100 / CHARITIES.length : allocations[c.id] || 0;
    const money = (annualDonation * pct) / 100;
    const units = Math.round(money / c.costPerOutputUSD);
    const preventedDeaths =
      c.costPerDeathAvertedUSD && c.costPerDeathAvertedUSD > 0
        ? money / c.costPerDeathAvertedUSD
        : 0;
    return {
      id: c.id,
      name: c.name,
      pct,
      money,
      units,
      preventedDeaths,
      color: COLORS[idx % COLORS.length],
      unitLabel: c.unitLabel.toLowerCase(),
    };
  });

  const totalPct = data.reduce((sum, d) => sum + d.pct, 0);
  const totalPreventedDeaths = data.reduce((s, d) => s + d.preventedDeaths, 0);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading2}>Overall Impact</h2>

      <p className={styles.kpi}>
        Estimated deaths prevented in total:{" "}
        <strong>
          {totalPreventedDeaths.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        </strong>
      </p>

      {/* Pie - donation split */}
      <h3 className={styles.subHeading}>Donation split</h3>
      <ResponsiveContainer width="100%" height={260} className={styles.chart}>
        <PieChart>
          <Pie
            data={data}
            dataKey="money"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
          >
            {data.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Bar - units */}
      <h3 className={styles.subHeading}>Tangible results (units)</h3>
      <ResponsiveContainer
        width="100%"
        height={280}
        className={styles.barChart}
      >
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="units">
            {data.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <h3 className={styles.subHeading}>Estimated deaths prevented</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(v) => v.toFixed(2)} />
          <Bar dataKey="preventedDeaths">
            {data.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Bullets */}
      <ul className={styles.bullets}>
        {data.map((d) => (
          <li key={d.id}>
            <strong>{d.units.toLocaleString()}</strong> {d.unitLabel} through{" "}
            <strong>{d.name}</strong>
            {mode === "custom" && (
              <>
                {" "}
                (<strong>{d.pct.toFixed(0)}% of total donation</strong>)
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Total indicator */}
      {mode === "custom" && (
        <p
          className={totalPct === 100 ? styles.validTotal : styles.invalidTotal}
        >
          Total allocation: {totalPct}%{" "}
          {totalPct !== 100 && "← adjust to 100 %"}
        </p>
      )}
    </section>
  );
}
