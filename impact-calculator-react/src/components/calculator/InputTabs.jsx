import React from "react";
import styles from "./InputTabs.module.css";

export function InputTabs({ value, onChange, children }) {
  const tabs = React.Children.toArray(children);

  return (
    <div>
      <div className={styles.bar}>
        {tabs.map((tab) => (
          <button
            key={tab.props.value}
            className={`${styles.tab} ${
              value === tab.props.value ? styles.active : ""
            }`}
            onClick={() => onChange(tab.props.value)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {tabs.find((tab) => tab.props.value === value)}
    </div>
  );
}
