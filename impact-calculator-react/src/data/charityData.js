import amfLogo from "../assets/against-malaria-foundation-logo.png";
import mcLogo from "../assets/malaria-consortium-logo.png";
import niLogo from "../assets/new-incentives-logo.png";
import hkiLogo from "../assets/helen-keller-logo.png";

export const CHARITIES = [
  {
    id: "MC",
    name: "Malaria Consortium",
    costPerOutputUSD: 20,
    costPerDeathAvertedUSD: 5000,
    logo: { src: mcLogo, width: 210 },
    description:
      "",
    unitLabel: "Children protected from malaria for a year with SMC",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
  {
    id: "AMF",
    name: "Against Malaria Foundation",
    costPerOutputUSD: 2,
    costPerDeathAvertedUSD: 5500,
    logo: { src: amfLogo, width: 106 },
    description:
      "",
    unitLabel: "Bednets purchased, distributed, and monitored",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
  {
    id: "NI",
    name: "New Incentives",
    costPerOutputUSD: 5,
    costPerDeathAvertedUSD: 5000,
    logo: { src: niLogo, width: 230 },
    description:
      "",
    unitLabel: "Children vaccinated",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
  {
    id: "HKI",
    name: "Helen Keller International",
    costPerOutputUSD: 1,
    costPerDeathAvertedUSD: 3200,
    logo: { src: hkiLogo, width: 108 },
    description:
      "",
    unitLabel:
      "Children given a year's Vitamin A supplementation, helping prevent early childhood blindness",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
];
