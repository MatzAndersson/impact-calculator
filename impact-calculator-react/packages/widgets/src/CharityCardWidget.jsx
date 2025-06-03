import React from "react";
import styles from "./CharityCardWidget.module.css";

const labels = {
  MC: "Children protected for 1 year",
  AMF: "Bednets provided",
  NI: "Children vaccinated",
  HKI: "Children given Vitamin A for 1 year",
};

export function CharityCardWidget({ charity, impactAmount }) {
  return (
    <div className={styles.card}>
      <img
        src={charity.logo.src}
        width={charity.logo.width}
        alt={`${charity.name} logo`}
        className={styles.logo}
      />
      <h3 className={styles.cardTitle}>{charity.name}</h3>
      <div className={styles.impactAmount}>
        {impactAmount.toLocaleString()}
      </div>
      <div className={styles.impactLabel}>{labels[charity.id]}</div>
    </div>
  );
}