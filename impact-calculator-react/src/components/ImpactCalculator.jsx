import React, { useState } from "react";
import { CHARITIES } from "../data/charityData.js";
import "./ImpactCalculator.css";

const CURRENCIES = ["USD", "GBP", "AUD", "CAD"];

export function ImpactCalculator() {
  const [inputs, setInputs] = useState({
    salaryNow: 120000,
    growthRate: 0.04, // 4%
    currentAge: 30,
    retirementAge: 65,
    pledgePercent: 0.01, // 1%
    currency: "USD",
  });
  function update(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const annualDonation = inputs.salaryNow * inputs.pledgePercent;
  const pledgeUrl =
    inputs.currency === "USD"
      ? "https://www.1fortheworld.org/take-the-pledge"
      : `https://www.1fortheworld.org/take-the-pledge-${inputs.currency.toLowerCase()}`;

  return (
    <section className="ic-wrapper">
      <div className="ic-panel">
        <fieldset
          className="form__fieldset"
          style={{ border: "none", padding: 0 }}
        >
          <legend className="form__legend">My annual gross salary is:</legend>
          <div className="form-row">
            <select
              aria-label="Currency"
              value={inputs.currency}
              onChange={(e) => update("currency", e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              aria-label="Salary"
              type="number"
              value={inputs.salaryNow}
              onChange={(e) => update("salaryNow", Number(e.target.value))}
            />
          </div>
          <div className="form__range-input-wrapper">
            <label htmlFor="pledgePercent" className="form__range-input-label">
              I'd like to donate{" "}
              <span className="impactCalculatorHighlight">
                {(inputs.pledgePercent * 100).toFixed(1)}%
              </span>
            </label>
            <input
              id="pledgePercent"
              type="range"
              min={0.1}
              max={10.0}
              step={0.1}
              value={inputs.pledgePercent * 100}
              onChange={(e) =>
                update("pledgePercent", Number(e.target.value) / 100)
              }
            />

             <div className="annual-donation">
      Annual donation:&nbsp;
      {annualDonation.toLocaleString(undefined,{
        style:'currency',
        currency:inputs.currency,
        maximumFractionDigits:0
      })}
    </div>
    </div>
        </fieldset>

        <a className="impact-calculator-donation-button" href={pledgeUrl}>
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
      </div>
      <section className="results">
        {CHARITIES.map((c) => {
          const outputs = annualDonation / CHARITIES.length / c.costPerUnit;
          const deaths = outputs * c.deathsPerUnit;

          return (
            <article key={c.id} className="charity-card">
              <img src={c.logo.src} width={c.logo.width} alt="" />
              <p>{c.output}</p>
              <strong>{Math.floor(outputs)}</strong> outputs&nbsp;&nbsp;
              <strong className="orange">{deaths.toFixed(2)}</strong> deaths
              averted
            </article>
          );
        })}
      </section>
    </section>
  );
}
