import React, { useState } from "react";
import amfLogo from "../assets/against-malaria-foundation-logo.png";
import mcLogo from "../assets/malaria-consortium-logo.png";
import niLogo from "../assets/new-incentives-logo.png";
import hkiLogo from "../assets/helen-keller-logo.png";
import "./ImpactCalculator.css";

const CHARITIES = {
  MC: {
    name: "Malaria Consortium",
    costPerUnit: 5000, // USD per “child protected” (adjust)
    deathsPerUnit: 1 / 72000, // example: 1 death averted per 72000 children
    logo: { src: mcLogo, width: 210 },
    output: "Children protected from malaria for a year with SMC.",
  },
  AMF: {
    name: "Against Malaria Foundation",
    costPerUnit: 5500,
    deathsPerUnit: 1 / 800, // example ratio – change to your figure
    logo: { src: amfLogo, width: 106 },
    output: "Bednets purchased, distributed, monitored.",
  },
  NI: {
    name: "New Incentives",
    costPerUnit: 5000,
    deathsPerUnit: 1 / 1400,
    logo: { src: niLogo, width: 230 },
    output: "Children vaccinated.",
  },
  HKI: {
    name: "Helen Keller International",
    costPerUnit: 3500,
    deathsPerUnit: 1 / 3200,
    logo: { src: hkiLogo, width: 108 },
    output: "Vitamin A supplementation for a year.",
  },
};

const CURRENCIES = ["USD", "GBP", "AUD", "CAD"];

export function ImpactCalculator() {
  const [state, setState] = useState({
    salary: 150000,
    currency: "USD",
    percent: 1.0,
    charities: null,
  });

   const annualDonation = state.salary * (state.percent / 100);

  function getCTAUrl(currency) {
    const base = "https://www.1fortheworld.org/take-the-pledge";
    return currency === "USD" ? base : `${base}-${currency.toLowerCase()}`;
  }
  function handleSalaryChange(e) {
    setState((prev) => ({
      ...prev,
      salary: Number(e.target.value),
    }));
  }

  function handleCurrencyChange(e) {
    setState((prev) => ({
      ...prev,
      currency: e.target.value,
    }));
  }

  function handlePercentChange(e) {
    setState((prev) => ({
      ...prev,
      percent: Number(e.target.value),
    }));
  }

  return (
    <section className="ic-wrapper">
      <div className="ic-panel">

    
      <fieldset className="form__fieldset">
        <legend className="form__legend">My annual gross salary is:</legend>
        <div>
          <select
            aria-label="Currency"
            name="impactCalculatorCurrency"
            value={state.currency}
            onChange={handleCurrencyChange}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            aria-label="Salary"
            type="number"
            value={state.salary}
            onChange={handleSalaryChange}
            onKeyDown={(e) => {
              if (
                (!["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(
                  e.code
                ) &&
                  isNaN(Number(e.key))) ||
                e.code === "Space"
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="form__range-input-wrapper">
          <label
            htmlFor="impactCalculatorPercent"
            className="form__range-input-label"
          >
            I'd like to donate{" "}
            <span className="impactCalculatorHighlight">
              {state.percent.toFixed(1)}%
            </span>
          </label>
          <input
            type="range"
            id="impactCalculatorPercent"
            value={state.percent}
            min={0.1}
            max={10.0}
            step={0.1}
            onChange={handlePercentChange}
          />
        </div>
      </fieldset>
      </div>
      <a
        className="impact-calculator-donation-button"
        href={getCTAUrl(state.currency)}
      >
        <span className="impact-calculator-donation-button__label">
          Donate this amount
        </span>
        <svg
          className="impact-calculator-donation-button__icon"
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
      <section className="results">
      {Object.values(CHARITIES).map((c) => {
          const units  = Math.floor(annualDonation / c.costPerUnit);
         const deaths = (units * c.deathsPerUnit).toFixed(2);

          return (
            <article key={c.name} className="charity-card">
              <img src={c.logo.src} width={c.logo.width} alt={`${c.name} logo`} />
              <div>
                <p>{c.output}</p>
                <strong>{units}</strong> outputs&nbsp;&nbsp;
                <strong style={{ color: '#d95b28' }}>{deaths}</strong> deaths averted
              </div>
            </article>
          );
        })}
        
      </section>
    
     </section>
  );
}
