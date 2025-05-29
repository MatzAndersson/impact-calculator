import { useMemo } from "react";
import calculateLifetimeImpact from "../utils/calculateLifetimeImpact";

export default function useLifetimeImpact(options) {
  // Memoise so it only recalculates when options change
  return useMemo(
    () => calculateLifetimeImpact(options),
    // crude (but easy) dep: stringify the object
    [JSON.stringify(options)]
  );
}