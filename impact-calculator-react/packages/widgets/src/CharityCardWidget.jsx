import React from "react";
import styles from "./CharityCardWidget.module.css";

const labels = {
  MC: "Children protected from malaria for a year with SMC",
  AMF: "Bednets purchased, distributed, and monitored",
  NI: "Children vaccinated",
  HKI: "Children given a year's Vitamin A supplementation"
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