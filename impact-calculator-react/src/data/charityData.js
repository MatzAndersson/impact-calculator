import amfLogo from "../assets/against-malaria-foundation-logo.png";
import mcLogo from "../assets/malaria-consortium-logo.png";
import niLogo from "../assets/new-incentives-logo.png";
import hkiLogo from "../assets/helen-keller-logo.png";

export const CHARITIES = [
  {
    id: "MC",
    name: "Malaria Consortium",
    costPerOutputUSD: 7,
    costPerDeathAvertedUSD: 4500,
    logo: { src: mcLogo, width: 210 },
    description: "",
    unitLabel: "Children protected from malaria for a year with SMC",
    preventedDeathsLabel: "Estimated deaths prevented",
    infoUrl: "https://www.givewell.org/charities/malaria-consortium",
    details: [
      {
        heading: "Overview",
        text: "Malaria kills around 600,000 people annually, mostly children under 5 in sub-Saharan Africa. Seasonal malaria chemoprevention is preventive medicine that saves children's lives. It is given during the four months of the year when malaria infection rates are especially high.",
      },
      {
        heading: "Cost-effectiveness",
        text: "About $7 to protect a child from malaria. In 2021-2023, we directed funding to the Malaria Consortium to support this program at an estimated average cost-effectiveness of $4,500 per life saved.",
      },
      {
        heading: "Evidence of impact",
        text: "Exceptionally strong. Many high-quality studies of seasonal malaria chemoprevention have consistently found strong impact. Malaria Consortium conducts valuable, high-quality ongoing monitoring.",
      },
    ],
  },
  {
    id: "AMF",
    name: "Against Malaria Foundation",
    costPerOutputUSD: 5,
    costPerDeathAvertedUSD: 5500,
    logo: { src: amfLogo, width: 106 },
    description: "",
    unitLabel: "Bednets purchased, distributed, and monitored",
    preventedDeathsLabel: "Estimated deaths prevented",
    infoUrl: "https://www.givewell.org/charities/amf",
     details: [
      {
        heading: "Overview",
        text: "Malaria kills around 600,000 people annually, mostly children under 5 in sub-Saharan Africa. Nets save lives. Recipients of nets hang and sleep under them so they are not bitten by malaria-carrying mosquitoes.",
      },
      {
        heading: "Cost-effectiveness",
        text: "About $5 to provide one net. In 2021-2023, we directed funding to the Against Malaria Foundation to support this program at an estimated average cost-effectiveness of $5,500 per life saved",
      },
      {
        heading: "Evidence of impact",
        text: "Exceptionally strong. Many high-quality studies of nets have consistently found strong impact. The Against Malaria Foundation conducts valuable ongoing monitoring.",
      },
    ],
  },
  {
    id: "NI",
    name: "New Incentives",
    costPerOutputUSD: 148,
    costPerDeathAvertedUSD: 4500,
    logo: { src: niLogo, width: 230 },
    description: "",
    unitLabel: "Children vaccinated",
    preventedDeathsLabel: "Estimated deaths prevented",
    infoUrl: "https://www.givewell.org/charities/new-incentives",
      details: [
      {
        heading: "Overview",
        text: "In Nigeria, 44% of infants did not receive all recommended childhood vaccines in 2021. This program provides cash transfers to incentivize caregivers to bring babies to clinics for routine childhood vaccinations, which prevent disease and reduce child mortality. It operates in Northern Nigeria.",
      },
      {
        heading: "Cost-effectiveness",
        text: "About $148 to vaccinate an infant. In 2021-2023, we directed funding to New Incentives to support this program at an estimated average cost-effectiveness of $4,500 per life saved",
      },
      {
        heading: "Evidence of impact",
        text: "Exceptionally strong. A high-quality study of New Incentives' program found strong impact. New Incentives conducts valuable, high-quality ongoing monitoring.",
      },
    ],
  },
  {
    id: "HKI",
    name: "Helen Keller International",
    costPerOutputUSD: 2,
    costPerDeathAvertedUSD: 3500,
    logo: { src: hkiLogo, width: 108 },
    description: "",
    unitLabel: "Children given a year's Vitamin A supplementation",
    preventedDeathsLabel: "Estimated deaths prevented",
    infoUrl: "https://www.givewell.org/charities/helen-keller-international",
    details: [
      {
        heading: "Overview",
        text: "Vitamin A deficiency leaves children vulnerable to infections and can lead to death. We estimate that approximately 27% of children in areas where we've modeled Helen Keller Intl's programs have vitamin A deficiency. This program saves lives by providing vitamin A supplements to children under 5 years old.",
      },
      {
        heading: "Cost-effectiveness",
        text: "About $2 to provide vitamin A supplements to a child for one year. In 2021-2023, we directed funding to Helen Keller Intl to support this program at an estimated average cost-effectiveness of $3,500 per life saved.",
      },
      {
        heading: "Evidence of impact",
        text: "Very strong. Many high-quality studies of vitamin A supplementation show strong impact, though results vary by study. Helen Keller Intl conducts valuable ongoing monitoring.",
      },
    ],
  },
];
