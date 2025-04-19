import amfLogo from "../assets/against-malaria-foundation-logo.png";
import mcLogo from "../assets/malaria-consortium-logo.png";
import niLogo from "../assets/new-incentives-logo.png";
import hkiLogo from "../assets/helen-keller-logo.png";

export const CHARITIES = [
  {
    id: "MC",
    name: "Malaria Consortium",
    costPerUnit: 5000,
    deathsPerUnit: 1 / 72000,
    logo: { src: mcLogo, width: 210 },
    output: "Children protected from malaria for a year with SMC.",
  },
  {
    id: "AMF",
    name: "Against Malaria Foundation",
    costPerUnit: 5500,
    deathsPerUnit: 1 / 800,
    logo: { src: amfLogo, width: 106 },
    output: "Bednets purchased, distributed, monitored.",
  },
  {
    id: "NI",
    name: "New Incentives",
    costPerUnit: 5000,
    deathsPerUnit: 1 / 1400,
    logo: { src: niLogo, width: 230 },
    output: "Children vaccinated.",
  },
  {
    id: "HKI",
    name: "Helen Keller International",
    costPerUnit: 3500,
    deathsPerUnit: 1 / 3200,
    logo: { src: hkiLogo, width: 108 },
    output: "Vitamin A supplementation for a year.",
  },
];
