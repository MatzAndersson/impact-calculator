# One for the World – Impact Widgets

# Embed-ready “Small” & “Medium” lifetime-impact calculators

## 1 Quick embed (copy & paste)

> **Use the latest tag** in the URLs below (e.g. `v1.0.7`).  
> Nothing else is required — the script mounts itself automatically.

### Small widget ( badge-style )

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/<OWNER>/<REPO>@<TAG>/impact-calculator-react/packages/widgets/dist/impact-widget-small.css"
/>

<script src="https://cdn.jsdelivr.net/gh/<OWNER>/<REPO>@<TAG>/impact-calculator-react/packages/widgets/dist/embed-small.min.js"></script>
```

<details><summary>Ready-made example (current build)</summary>

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/MatzAndersson/impact-calculator@v1.0.7/impact-calculator-react/packages/widgets/dist/impact-widget-small.css"
/>
<script src="https://cdn.jsdelivr.net/gh/MatzAndersson/impact-calculator@v1.0.7/impact-calculator-react/packages/widgets/dist/embed-small.min.js"></script>
```

</details>
### Medium widget ( more features, scaled down Impact Calculator )

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/<OWNER>/<REPO>@<TAG>/impact-calculator-react/packages/widgets/dist/impact-widget-medium.css"
/>

<script src="https://cdn.jsdelivr.net/gh/<OWNER>/<REPO>@<TAG>/impact-calculator-react/packages/widgets/dist/embed-medium.min.js"></script>
```

<details><summary>Ready-made example (current build)</summary>

<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/MatzAndersson/impact-calculator@v1.0.7/impact-calculator-react/packages/widgets/dist/impact-widget-medium.css">
<script src="https://cdn.jsdelivr.net/gh/MatzAndersson/impact-calculator@v1.0.7/impact-calculator-react/packages/widgets/dist/embed-medium.min.js"></script>

</details>

## 2 Styling & theming

| What you can change | How                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **Colours**         | Override CSS variables (`--color-primary`, `--color-secondary`, …) before the widget loads. |
| **Dark mode**       | Include `theme-dark.css` *or* wrap the widget in `<div class="oftw-dark">…</div>`.          |
| **Container width** | Small widget: `clamp(14rem, 90%, 18rem)`.<br>Medium widget: fully responsive.               |


## 3 Upgrading to a new release

1. Replace the tag in both URLs (e.g. `v1.0.8`).
2. _(optional)_ Purge jsDelivr:  
   `https://purge.jsdelivr.net/gh/<OWNER>/<REPO>@<TAG>`
3. Verify:  
   `https://data.jsdelivr.com/v1/package/gh/<OWNER>/<REPO>@<TAG>`

## 4 Local development

```bash
# inside impact-calculator-react/packages/widgets
npm install          # first time only
npm run dev          # http://localhost:5173
```

### Build distributables

```bash
npm run build:small   # dist/embed-small.min.js   + impact-widget-small.css
npm run build:medium  # dist/embed-medium.min.js + impact-widget-medium.css
```

## 5 Release checklist

```bash
# 0. bump version in package.json if desired
npm run build:small && npm run build:medium

git add impact-calculator-react/packages/widgets/dist
git commit -m "Build widgets for vX.Y.Z"
git push origin main

git tag vX.Y.Z
git push origin vX.Y.Z         # publish tag

# (optional) force jsDelivr to refresh
open open https://purge.jsdelivr.net/gh/<OWNER>/<REPO>@vX.Y.Z
```
