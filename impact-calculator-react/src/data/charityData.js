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
      "The Seasonal Malaria Chemoprevention program protects children from malaria by distributing preventative medication at times of high transmission.",
    unitLabel: "Children protected from malaria for a year with SMC.",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
  {
    id: "AMF",
    name: "Against Malaria Foundation",
    costPerOutputUSD: 2,
    costPerDeathAvertedUSD: 5500,
    logo: { src: amfLogo, width: 106 },
    description:
      "AMF's bed net programs protect people from malaria by distributing and ensuring the use of long-lasting insecticidal bednets in regions with the highest burden of malaria cases.",
    unitLabel: "Bednets purchased, distributed, and monitored.",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
  {
    id: "NI",
    name: "New Incentives",
    costPerOutputUSD: 5,
    costPerDeathAvertedUSD: 5000,
    logo: { src: niLogo, width: 230 },
    description:
      "New Incentives improves childhood immunization rates in Nigeria by providing cash incentives to caregivers.",
    unitLabel: "Children vaccinated.",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
  {
    id: "HKI",
    name: "Helen Keller International",
    costPerOutputUSD: 1,
    costPerDeathAvertedUSD: 3200,
    logo: { src: hkiLogo, width: 108 },
    description:
      "Helen Keller Intl's Vitamin A Supplementation program Improves child health and survival rates by partnering with governments across Africa to deliver lifesaving vitamin A supplements and complementary activities to millions of children annually.",
    unitLabel:
      "Children given a year's Vitamin A supplementation, helping prevent early childhood blindness",
    preventedDeathsLabel: "Estimated deaths prevented",
  },
];
