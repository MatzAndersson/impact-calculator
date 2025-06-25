# Impact Calculator — One for the World
This is the React + Vite project for the One for the World Impact Calculator.
---

## Features

- Responsive React app to help users estimate their charitable impact
- Donation allocation sliders and live summary
- Currency and age/lifetime support
- **Optional Email Gate** for gathering user emails before calculating (disabled by default; see below)
- Easy to deploy as a static site (`dist/` folder)

---

## 🛠️ Getting Started
1. **Install dependencies**
    ```
    npm install
    ```

2. **Run the development server**
    ```
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Production Build
1. **Build the static site**
    ```bash
    npm run build
    ```
    This will create a `dist/` folder containing the production build.

2. **Preview the production build locally**
    ```bash
    npm run preview
    ```

---


## 🚚 Deploying

- The contents of the `dist/` folder can be uploaded to any static hosting provider (e.g. Netlify, Vercel, GitHub Pages, S3, Firebase Hosting).

- **Squarespace users:** Squarespace does _not_ support uploading full static React sites. To add the calculator to a Squarespace page, you can deploy the `dist/` folder to a static host (such as Netlify) and embed it with an `<iframe>`, or link to it as a separate page.

---

## ✉️ Email Gate Toggle
To require users to enter an email before seeing results, set the flag in `src/pages/ImpactCalculatorPage.jsx`:

```js
const ENABLE_EMAIL_GATE = true; // set to true to enable, false to disable
```
---


### 🧩 Widgets
If you want to embed the calculator as a widget (or see other widget variants), read
packages/widgets/README.md.

---
### 📦 Dependencies
- React ^19.0.0
- Vite
- Other dependencies listed in package.json

## 📬 Contact / Handover
For questions or deployment support, please contact [Matz Andersson / matz_andersson_83@hotmail or maan2310@student.miun.se].



