import React from "react";

export function InputTabs({ value, onChange, children }) {
  const tabs = React.Children.toArray(children);

  return (
    <div>
      <div className="tabs-bar">
        {tabs.map((tab) => (
          <button
            key={tab.props.label}
            className={value === tab.props.label ? "tab active" : "tab"}
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
