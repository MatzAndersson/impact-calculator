import useDebounce from "../../hooks/useDebounce";
import { Tooltip } from "react-tooltip";
import styles from "./Forms.module.css";

export function LifetimeForm({ inputs, update }) {
  const isAnnual = inputs.salaryPeriod === "annual";

  const curr = parseFloat(inputs.currentAge);
  const ret = parseFloat(inputs.retirementAge);
  const agesTouched = inputs.currentAge !== "" && inputs.retirementAge !== "";
  const ageInvalid = agesTouched && ret <= curr;

  // wait 500 ms before showing the error
  const showError = useDebounce(ageInvalid, 500);

  return (
    <>
      {/* ------------- Salary period toggle ------------- */}
      <div className={styles.formRow}>
        <div className={`${styles.formControl} ${styles.periodToggle}`}>
          <label className={styles.radioInline}>
            <input
              type="radio"
              name="salaryPeriod"
              value="annual"
              checked={isAnnual}
              onChange={() => update("salaryPeriod", "annual")}
            />
            Annual salary
          </label>
          <label className={styles.radioInline} style={{ marginLeft: "12px" }}>
            <input
              type="radio"
              name="salaryPeriod"
              value="monthly"
              checked={!isAnnual}
              onChange={() => update("salaryPeriod", "monthly")}
            />
            Monthly salary
          </label>
        </div>
      </div>
      {/* salary + currency + growth rate row*/}
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="lifetimeCurrency">Currency</label>
          <select
            id="lifetimeCurrency"
            className={styles.selectBase}
            value={inputs.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            {["USD", "GBP", "AUD", "CAD"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.formControl}>
          <label htmlFor="lifetimeSalary">
            {isAnnual ? "Annual salary" : "Monthly salary"}
          </label>
          <input
            id="lifetimeSalary"
            className={styles.inputBase}
            type="number"
            min="0"
            value={
              isAnnual
                ? inputs.salaryNow === 0
                  ? ""
                  : inputs.salaryNow
                : inputs.monthlySalary === 0
                ? ""
                : inputs.monthlySalary
            }
            placeholder={isAnnual ? "e.g. 50 000" : "e.g. 4 000"}
            onChange={(e) =>
              isAnnual
                ? update(
                    "salaryNow",
                    e.target.value === ""
                      ? ""
                      : +e.target.value /* "" or Number */
                  )
                : update(
                    "monthlySalary",
                    e.target.value === "" ? "" : +e.target.value
                  )
            }
          />
        </div>
        <div className={`${styles.formControl} ${styles.growthControl}`}>
          <label htmlFor="growthRate">
            Salary growth rate
            <span data-tooltip-id="growthTip" className={styles.helpIcon}>
              ?
            </span>
          </label>
          <div className={styles.suffixInput}>
            <input
              id="growthRate"
              className={styles.inputBase}
              type="number"
              step="0.01"
              value={inputs.growthRate === 0 ? "" : inputs.growthRate}
              onChange={(e) =>
                update(
                  "growthRate",
                  e.target.value === "" ? "" : +e.target.value
                )
              }
              placeholder="e.g. 4%"
            />
            <span className={styles.suffix}>%</span>
          </div>
          <Tooltip
            id="growthTip"
            place="top"
            className={styles.growthTooltip}
            content={`We assume your salary will grow ~4% per year—typical long-term wage growth
    in the U.S. and much of Western Europe. If you expect faster promotions or
    higher inflation, you can bump this up; if you’re in a slower-growth job
    or region (e.g. 2–3% annual), feel free to lower it.`}
          />
        </div>
      </div>

      {/* ages row */}
      <div className={styles.formRow}>
        <div className={styles.formControl}>
          <label htmlFor="currentAge">Current age</label>
          <input
            className={styles.inputBase}
            type="number"
            value={inputs.currentAge === 0 ? "" : inputs.currentAge}
            onChange={(e) =>
              update("currentAge", e.target.value === "" ? "" : +e.target.value)
            }
            placeholder="e.g. 25"
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="retirementAge">Retirement age</label>
          <input
            id="retirementAge"
            className={styles.inputBase}
            type="number"
            value={inputs.retirementAge === 0 ? "" : inputs.retirementAge}
            onChange={(e) =>
              update(
                "retirementAge",
                e.target.value === "" ? "" : +e.target.value
              )
            }
            placeholder="e.g. 65"
          />
          {showError && (
            <div className={styles.errorText}>
              *Retirement age must be greater than current age
            </div>
          )}
        </div>
      </div>
    </>
  );
}
