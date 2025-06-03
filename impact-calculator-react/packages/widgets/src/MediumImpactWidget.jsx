import React, { useState, useEffect } from "react";
import { fetchEvaluations } from "./api/Evaluations";
import { ImpactSummary } from "./ImpactSummary";
import { getCharityImpacts } from "./utils/getCharityImpacts";
import { CharityCardWidget } from "./CharityCardWidget";
import { charities } from "./charities";
import styles from "./MediumImpactWidget.module.css";

const sr = "sr-only";
const allocations = { MC: 25, AMF: 25, NI: 25, HKI: 25 };
export default function MediumImpactWidget({
  learnMoreUrl = "https://1fortheworld.org/impact-calculator",
}) {
  const [salary, setSalary] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [conversionRate, setConversionRate] = useState(1);
  const [currency, setCurrency] = useState("USD");

  // Parse numeric values or fall back to 0
  const salaryNum = parseFloat(salary.replace(/[^0-9.]/g, "")) || 0;
  const currentAgeNum = parseInt(currentAge, 10) || 0;
  const retirementAgeNum = parseInt(retirementAge, 10) || 0;

  useEffect(() => {
    const abbrevs = charities.map((c) => c.id);
    let isMounted = true;
    async function loadEvaluationsAndRate() {
      try {
        // 1) fetch the API data
        const evs = await fetchEvaluations(abbrevs, currency);
        if (!isMounted) return;

        // 2) store the raw evaluations
        setEvaluations(evs);

        // 3) derive USD→local conversion from the first charity
        if (evs.length > 0) {
          const sample = evs[0];
          const centsPerUnit = sample.cents_per_output; // e.g. 500 (cents)
          const localPerUnit = sample.converted_cost_per_output; // e.g. 400 (local)
          const rate = localPerUnit / (centsPerUnit / 100);
          setConversionRate(rate);
        }
      } catch (err) {
        console.error("API failed:", err);
        if (!isMounted) return;
        setEvaluations([]);
        setConversionRate(1); // fallback to 1:1
      }
    }

    loadEvaluationsAndRate();

    return () => {
      isMounted = false;
    };
  }, [currency]);

  const mergedCharities = charities.map((charity) => {
    const evaluation = evaluations.find(
      (e) => e.charity.abbreviation === charity.id
    );
    return {
      ...charity,
      costPerOutput: evaluation
        ? evaluation.converted_cost_per_output
        : charity.costPerOutputUSD,
      costPerDeathAvertedUSD:
        evaluation && evaluation.cost_per_death_averted
          ? evaluation.cost_per_death_averted
          : charity.costPerDeathAvertedUSD,
    };
  });
  const impactData = getCharityImpacts({
    salaryNow: salaryNum,
    currentAge: currentAgeNum,
    retirementAge: retirementAgeNum,
    allocations,
    charities,
    conversionRate,
  });

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.leftSection}>
        <h2 className={styles.title}>Calculate your 1% impact</h2>
        <div className={styles.field}>
          <div className={styles.inputPairWrapper}>
            <div className={styles.rowLabels}>
              <label htmlFor="currency">Currency</label>
              <label htmlFor="salary" style={{ marginLeft: "12px" }}>
                Annual salary
              </label>
            </div>
            <div className={styles.inputRow}>
              <select
                id="currency"
                className={styles.currencySelect}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
              <input
                type="text"
                className={styles.salaryInput}
                id="salary"
                min="0"
                step="1000"
                placeholder="e.g. 50,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                onBlur={() =>
                  setSalary(
                    salary
                      .replace(/[^\d]/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.horizontalInputs}>
          <div className={styles.ageInputs}>
            <label htmlFor="age-now" className={sr}>
              Current age
            </label>
            <input
              id="age-now"
              type="number"
              min="0"
              max="100"
              className={styles.input}
              placeholder="e.g. 25"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
            />
          </div>
          <div className={styles.ageInputs}>
            <label htmlFor="age-retire" className={sr}>
              Retirement age
            </label>
            <input
              id="age-retire"
              type="number"
              min="0"
              max="100"
              className={styles.input}
              placeholder="e.g. 65"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {impactData.map((item) => (
            <CharityCardWidget
              key={item.id}
              charity={item}
              impactAmount={item.impactAmount}
            />
          ))}
        </div>

        
      </div>
      <div className={styles.rightSection}>
        <ImpactSummary
          allocations={allocations}
          currency={currency}
          conversionRate={conversionRate}
          salaryNow={salaryNum}
          currentAge={currentAgeNum}
          retirementAge={retirementAgeNum}
          evaluations={evaluations}
          charities={mergedCharities}
        />
        <a href={learnMoreUrl} className={styles.link}>
          Discover more at One for the World
        </a>
      </div>
      
    </div>
  );
}
