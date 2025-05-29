import React from "react";
import { createRoot } from "react-dom/client";
import SmallImpactWidget from "./SmallImpactWidget";
import css from "./SmallImpactWidget.module.css?inline";
import "./global.css";
import "./theme-dark.css";

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

const mount =
  document.getElementById("oftw-impact-widget") ||
  Object.assign(document.createElement("div"), { id: "oftw-impact-widget" });
document.body.appendChild(mount);

createRoot(mount).render(<SmallImpactWidget />);
