import React from "react";
import { createRoot } from "react-dom/client";
import SmallImpactWidget from "./SmallImpactWidget";
import "./SmallImpactWidget.module.css";
import "./global.css";
import "./theme-dark.css";

const mount =
  document.getElementById("oftw-impact-widget-small") ||
  Object.assign(document.createElement("div"), {
    id: "oftw-impact-widget-small",
  });
document.body.appendChild(mount);

createRoot(mount).render(<SmallImpactWidget />);
