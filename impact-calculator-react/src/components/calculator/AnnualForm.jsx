export function AnnualForm({ inputs, update }) {
  return (
    <>
      <div className="form-row">
        <select
          value={inputs.currency}
          onChange={(e) => update("currency", e.target.value)}
        >
          {["USD", "GBP", "AUD", "CAD"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          value={inputs.salaryNow}
          onChange={(e) => update("salaryNow", Number(e.target.value))}
        />
      </div>
    </>
  );
}
