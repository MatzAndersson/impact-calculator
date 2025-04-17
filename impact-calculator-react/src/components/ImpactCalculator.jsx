import React, { useState } from "react";
import './ImpactCalculator.css';
const CHARITIES = {
  MC: {
    costPerDeathAvertedUSD: 5000,
    logo: {
      src: "images/malaria-consortium-logo.png",
      width: 210,
    },
    name: "Malaria Consortium",
    outputDescription:
      "Children protected from malaria for a year with seasonal malaria chemoprevention.",
  },
  AMF: {
    costPerDeathAvertedUSD: 5500,
    logo: {
      src: "images/against-malaria-foundation-logo.png",
      width: 106,
    },
    name: "Against Malaria Foundation",
    outputDescription: "Bednets purchased, distributed, and monitored",
  },
  NI: {
    costPerDeathAvertedUSD: 5000,
    logo: {
      src: "images/new-incentives-logo.png",
      width: 230,
    },
    name: "New Incentives",
    outputDescription: "Children vaccinated",
  },
  HKI: {
    costPerDeathAvertedUSD: 3500,
    logo: {
      src: "images/helen-keller-logo.png",
      width: 108,
    },
    name: "Helen Keller International",
    outputDescription:
      "Children given a year's Vitamin A supplementation, helping prevent early childhood blindness",
  },
};

const CURRENCIES = ["USD", "GBP", "AUD", "CAD"];

export function ImpactCalculator() {
    const [state, setState] = useState({
      salary: 150000,
      currency: 'USD',
      percent: 1.0,
      charities: null
    });

    function getCTAUrl(currency) {
        const base = 'https://www.1fortheworld.org/take-the-pledge';
        return currency === 'USD' ? base : `${base}-${currency.toLowerCase()}`;
      }
      function handleSalaryChange(e) {
        setState(prev => ({
          ...prev,
          salary: Number(e.target.value)
        }));
      }
    
      function handleCurrencyChange(e) {
        setState(prev => ({
          ...prev,
          currency: e.target.value
        }));
      }
    
      function handlePercentChange(e) {
        setState(prev => ({
          ...prev,
          percent: Number(e.target.value)
        }));
      }
    
      return (
        <div className="main-container" id="impactCalculatorDiv">
          <fieldset className="form__fieldset">
            <legend className="form__legend">My annual gross salary is:</legend>
            <div>
              <select
                aria-label="Currency"
                name="impactCalculatorCurrency"
                value={state.currency}
                onChange={handleCurrencyChange}
              >
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <input
                aria-label="Salary"
                type="number"
                value={state.salary}
                onChange={handleSalaryChange}
                onKeyDown={(e) => {
                  if (!['Backspace','Delete','ArrowLeft','ArrowRight'].includes(e.code) 
                      && isNaN(Number(e.key)) || e.code === 'Space') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form__range-input-wrapper">
              <label htmlFor="impactCalculatorPercent" className="form__range-input-label">
                I'd like to donate <span className="impactCalculatorHighlight">{state.percent.toFixed(1)}%</span>
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
          <a className="impact-calculator-donation-button" href={getCTAUrl(state.currency)}>
            <span className="impact-calculator-donation-button__label">
              Donate this amount
            </span>
            <svg className="impact-calculator-donation-button__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      );
    }

