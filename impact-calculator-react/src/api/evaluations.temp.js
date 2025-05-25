const API_BASE = "https://impact.gieffektivt.no/api/evaluations";
/**
 * Fetch the GiveWell evaluations for a set of charity abbreviations.
 * Returns a Promise resolving to the `evaluations` array from the API.
 *
 *
 */

export async function fetchEvaluations(abbrevs, currency) {
    const year  = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const params = new URLSearchParams();
    abbrevs.forEach(a => params.append("charity_abbreviation", a));
    params.set("donation_year",  year);
    params.set("donation_month", month);
    params.set("currency",       currency);
  
    const res = await fetch(`${API_BASE}?${params.toString()}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }
    const data = await res.json();
    if (data.errors?.length) {
      throw new Error(data.errors.join(", "));
    }
    return data.evaluations;
  }