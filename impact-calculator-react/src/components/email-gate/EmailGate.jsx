import { useState } from "react";
import styles from "./EmailGate.module.css";
import logo from "../../assets/OFTW-Secondary-Logo-RGB-White-4k.png";
import pageStyles from '../../pages/ImpactCalculatorPage.module.css';

export function EmailGate({
  formId = "1FAIpQLSe2kLjDMR5sKbH9mouHCt70V9RsGac8rD_4rAAA9bSeF6GWiQ",
  entryKey = "entry.738971177",
  onSuccess,
  onClose,
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formId && entryKey) {
      // only do the fetch once we have those values
      const url = `https://docs.google.com/forms/d/e/1FAIpQLSe2kLjDMR5sKbH9mouHCt70V9RsGac8rD_4rAAA9bSeF6GWiQ/formResponse`;
      console.log("Posting to Google Forms URL:", url);
      const fd = new FormData();
      fd.append(entryKey, email);
      await fetch(url, { method: "POST", mode: "no-cors", body: fd });
    } else {
      console.warn("EmailGate: no formId/entryKey provided—skipping POST");
    }

    sessionStorage.setItem("gatedEmail", email);
    onSuccess(email);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        )}
        {/* Example logo at top */}
        <img
          src={logo}
          alt="OFTW Logo"
          className={styles.logo}
        />

        <h2 className={styles.heading}>
          Enter your email to see your Impact results
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="your_email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button
  type="submit"
  className={`${styles.button} ${pageStyles.calculateBtn}`}
>
  Continue
</button>
        </form>
      </div>
    </div>
  );
}
