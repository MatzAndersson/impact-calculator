import React from "react";
import styles from "./TotalAllocationIndicator.module.css";

export function TotalAllocationIndicator({ total }) {
  const isValid = total === 100;
  return (
    <div
      className={[
        styles.totalPctIndicator,
        isValid ? styles.validTotal : styles.invalidTotal,
      ].join(" ")}
      style={{ gridColumn: "1 / -1" }}
    >
      Total allocation: {total}% { !isValid && "← adjust to 100 %" }
    </div>
  );
}