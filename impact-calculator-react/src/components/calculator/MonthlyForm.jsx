export function MonthlyForm({ inputs, update }) {
    return (
      <>
        <div className="form-row">
          <select
            value={inputs.currency}
            onChange={(e) => update('currency', e.target.value)}
          >
            {['USD','GBP','AUD','CAD'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
  
          <input
            type="number"
            value={inputs.monthlyAmount}
            min="0"
            onChange={(e)=>update('monthlyAmount', Number(e.target.value))}
            placeholder="Monthly donation"
          />
        </div>
      </>
    );
  }