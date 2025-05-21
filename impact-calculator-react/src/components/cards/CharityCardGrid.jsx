import {useMemo} from "react";
import { CHARITIES } from "../../data/charityData";
import { CharityCard } from "./CharityCard";
import styles from "./CharityCardGrid.module.css";

export function CharityCardGrid({
  breakdown,
  allocations,
  mode,
  onAllocationChange,
  ref,
}) 

{

  const totalPercentage = useMemo(
    () => Object.values(allocations).reduce((sum, p) => sum + p, 0),
    [allocations]
  );

  // ② Clamp newPct so that this one card + the others never exceed 100
  function handleSliderChange(id, newPct) {
    const remaining = 100 - (totalPercentage - allocations[id]);
    const clamped = Math.max(0, Math.min(newPct, remaining));
    onAllocationChange(id, clamped);
  }
  return (
    <section ref={ref} className={styles.resultsGrid}>
      {breakdown.map((item) => {
        const charity = CHARITIES.find((c) => c.id === item.id);
        return (
          <CharityCard
            key={item.id}
            charity={charity}
            breakdownItem={{
              output:     item.output,
              deaths:     item.deaths,
              shortDesc:  item.shortDesc,
              longDesc:   item.longDesc,
              givewellUrl:`https://www.givewell.org/charities/${item.id}`,
            }}
            allocation={allocations[item.id] || 0}
            mode={mode}
            onAllocationChange={handleSliderChange}
          />
        );
      })}
    </section>
  );
}
