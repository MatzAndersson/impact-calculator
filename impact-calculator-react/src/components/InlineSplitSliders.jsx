import React from "react";
import styles from "./InlineSplitSliders.module.css";

export function InlineSplitSliders({
  charities,
  allocations,
  onAllocationChange,
  isOpen
}) {
  return (
    <div
      className={[
        styles.inlineSliders,
        isOpen ? styles.open : ""
      ].join(" ")}
    >
      {charities.map((c) => (
        <div key={c.id} className={styles.sliderCard}>
          <img
            src={c.logo.src}
            alt={c.name}
            width={24}
            height={24}
            className={styles.sliderLogo}
          />
          <div className={styles.sliderName}>{c.name}</div>
          <input
            type="range"
            min={0}
            max={100}
            value={allocations[c.id]}
            onChange={(e) =>
              onAllocationChange(c.id, +e.target.value)
            }
          />
          <div className={styles.sliderValue}>
            <span className={styles.percentBox}>
      <input
        type="number"
        min={0}
        max={100}
        step={1}
        value={allocations[c.id]}
        onChange={(e) => onAllocationChange(c.id, +e.target.value)}
        onFocus={(e) => e.target.select()}
        className={styles.percentInput}
        aria-label={`${c.name} percentage`}
      />
      </span>
      <span className={styles.percentSymbol}>%</span>
    </div>
        </div>
      ))}
    </div>
  );
}