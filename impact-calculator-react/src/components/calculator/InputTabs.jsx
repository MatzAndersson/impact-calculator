import React from "react";
import styles from "./InputTabs.module.css";

export function InputTabs({ value, onChange, children }) {
  const tabs = React.Children.toArray(children);

  return (
    <div>
      <div className={styles.bar}>
        {tabs.map((tab) => (
          <button
            key={tab.props.label}
            className={`${styles.tab} ${value === tab.props.label ? styles.active : ''}`}
            onClick={() => onChange(tab.props.label)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {tabs.find((tab) => tab.props.label === value)}
    </div>
  );
}
