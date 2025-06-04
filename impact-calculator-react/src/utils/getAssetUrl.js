
export function getAssetUrl(filename) {
  
  const IS_PROD =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/wp-content/") ||
      window.location.hostname === "1fortheworld.org");
  if (IS_PROD) {
    return `/wp-content/themes/general/impact-calculator-main/impact-calculator-react/dist/assets/${filename}`;
  }
  
  return new URL(`../assets/${filename}`, import.meta.url).href;
}
