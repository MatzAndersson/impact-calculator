export function LifetimeForm({ inputs, update }) {
  return (
    <>
      {/* salary & currency – reuse AnnualForm or copy */}
      <div className="form-row">
        <input
          type="number"
          value={inputs.currentAge}
          onChange={(e) => update("currentAge", Number(e.target.value))}
          placeholder="Current age"
        />
        <input
          type="number"
          value={inputs.retirementAge}
          onChange={(e) => update("retirementAge", Number(e.target.value))}
          placeholder="Retirement age"
        />
      </div>

      <input
        type="number"
        step="0.01"
        value={inputs.growthRate}
        onChange={(e) => update("growthRate", Number(e.target.value))}
        placeholder="Salary growth rate e.g. 0.04"
      />
    </>
  );
}
