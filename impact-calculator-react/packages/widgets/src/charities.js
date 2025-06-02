import amfLogo from "./assets/against-malaria-foundation-logo.png";
import mcLogo from "./assets/malaria-consortium-logo.png";
import niLogo from "./assets/new-incentives-logo.png";
import hkiLogo from "./assets/helen-keller-logo.png";

export const charities = [
  {
    id: "MC",
    name: "Malaria Consortium",
    logo: { src: mcLogo, width: 210 },
    costPerOutputUSD: 7, 
     costPerDeathAvertedUSD: 4500,
  },
  {
    id: "AMF",
    name: "Against Malaria Foundation",
    logo: { src: amfLogo, width: 106 },
    costPerOutputUSD: 5,
    costPerDeathAvertedUSD: 5500,
  },
  {
    id: "NI",
    name: "New Incentives",
    logo: { src: niLogo, width: 230 },
    costPerOutputUSD: 148,
    costPerDeathAvertedUSD: 4500,
  },
  {
    id: "HKI",
    name: "Helen Keller International",
    logo: { src: hkiLogo, width: 108 },
    costPerOutputUSD: 2,
    costPerDeathAvertedUSD: 3500,
  }
];