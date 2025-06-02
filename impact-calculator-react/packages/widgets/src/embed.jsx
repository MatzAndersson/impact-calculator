import React from "react";
import { createRoot } from "react-dom/client";
import SmallImpactWidget from "./SmallImpactWidget";
import MediumImpactWidget from "./MediumImpactWidget";
import "./MediumImpactWidget.module.css";
import "./SmallImpactWidget.module.css";
import "./global.css";
import "./theme-dark.css";

const mount =
  document.getElementById("oftw-impact-widget") ||
  Object.assign(document.createElement("div"), { id: "oftw-impact-widget" });
document.body.appendChild(mount);

//createRoot(mount).render(<SmallImpactWidget />);
createRoot(mount).render(<MediumImpactWidget />);
