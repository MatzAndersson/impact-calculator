import React from "react";
import { createRoot } from "react-dom/client";
import MediumImpactWidget from "./MediumImpactWidget";
import "./MediumImpactWidget.module.css";
import "./global.css";
import "./theme-dark.css";

const mount =
  document.getElementById("oftw-impact-widget-medium") ||
  Object.assign(document.createElement("div"), {
    id: "oftw-impact-widget-medium",
  });
document.body.appendChild(mount);

createRoot(mount).render(<MediumImpactWidget />);
