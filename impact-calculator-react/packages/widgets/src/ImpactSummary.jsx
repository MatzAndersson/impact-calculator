import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import useLifetimeImpact from "./hooks/useLifetimeImpact";
import { getCharityImpacts } from "./utils/getCharityImpacts";
import { formatCurrency } from "./utils/formatCurrency";
import styles from "./ImpactSummary.module.css";

const COLORS = ["#26A7FF", "#FB6A37", "#E2FF3E", "#FEDBFD"];

function TwoRowLegend({ payload }) {
  const CLOCKWISE = ["MC", "AMF", "NI", "HKI"];

  const ordered = CLOCKWISE.map((id) =>
    payload.find((p) => p.payload.id === id)
  ).filter(Boolean);
  return (
    <ul className={styles.legend}>
      {ordered.map((entry) => (
        <li key={entry.value}>
          <span className={styles.dot} style={{ background: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

export function ImpactSummary({
  allocations,
  salaryNow,
  currentAge,
  retirementAge,
  currency,
  conversionRate,
  charities = [],
}) {
  const { lifetimeGiving } = useLifetimeImpact({
    salaryNow,
    pledgePercent: 0.01,
    growthRate: 0.04,
    currentAge,
    retirementAge,
  });
  console.log(
    "salaryNow:",
    salaryNow,
    "currentAge:",
    currentAge,
    "retirementAge:",
    retirementAge
  );
  console.log("lifetimeGiving:", lifetimeGiving);

  

  const data = getCharityImpacts({
    salaryNow,
    currentAge,
    retirementAge,
    allocations,
    charities,
    conversionRate,
  }).map((c, idx) => ({
    ...c,
    color: COLORS[idx % COLORS.length],
  }));
  const PIE_ORDER = ["MC", "AMF", "HKI", "NI"]; // NW → NE → SE → SW
  const pieData = PIE_ORDER.map((id) => data.find((d) => d.id === id)).filter(
    Boolean
  );
console.log(
  data.map(d => ({
    id: d.id,
    name: d.name,
    costPerDeathAvertedUSD: d.costPerDeathAvertedUSD,
    preventedDeaths: d.preventedDeaths
  }))
);
  const totalPreventedDeaths = data.reduce((s, d) => s + d.preventedDeaths, 0);
  const totalUnits = data.reduce((s, d) => s + d.units, 0);
  const costPerDeath =
    totalPreventedDeaths > 0 ? lifetimeGiving / totalPreventedDeaths : 0;

    console.log(
  data.map(d => ({
    id: d.id,
    name: d.name,
    costPerDeathAvertedUSD: d.costPerDeathAvertedUSD,
    preventedDeaths: d.preventedDeaths
  }))
);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading2}>Overall Impact</h2>

      {/* Pie - donation split */}

      <ResponsiveContainer width="100%" height={300} className={styles.chart}>
        {/* give ourselves breathing room so nothing clips */}
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={pieData}
            dataKey="moneyLocal"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            startAngle={180} // begin at 9 o’clock
            endAngle={-180}
            // turn off the default label & connector
            label={false}
            labelLine={false}
          >
            {pieData.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}

            {/* render our own outside % labels from the data.pct field */}
            <LabelList
              dataKey="pct"
              position="outside"
              distance={20} // push labels 20px beyond the outer radius
              formatter={(val) => (val > 0 ? `${val.toFixed(0)}%` : "")}
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
          <Tooltip formatter={(value) => formatCurrency(value, currency)} />
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
          Estimated deaths&nbsp;prevented
        </div>
      </div>
    </section>
  );
}
