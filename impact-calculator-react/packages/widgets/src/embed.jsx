import React from "react";
import { createRoot } from "react-dom/client";
import SmallImpactWidget from "./SmallImpactWidget";
import cssModule from "./SmallImpactWidget.module.css?inline";
import globalCss from "./global.css?inline";
import themeCss from "./theme-dark.css?inline";

const style = document.createElement("style");
style.textContent = [cssModule, globalCss, themeCss].join("\n");
document.head.appendChild(style);

const mount =
  document.getElementById("oftw-impact-widget") ||
  Object.assign(document.createElement("div"), { id: "oftw-impact-widget" });
document.body.appendChild(mount);

createRoot(mount).render(<SmallImpactWidget />);
