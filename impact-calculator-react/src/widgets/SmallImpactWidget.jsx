import React, { useState } from 'react'
import useCalculatorInputs from '../hooks/useCalculatorInputs'
import styles from './SmallImpactWidget.module.css'

/**
 * SmallImpactWidget
 * A simple lifetime-impact badge showing total lives saved.
 * Users input salary, current age, and retirement age (via placeholders).
 * Props:
 *  - learnMoreUrl: string (URL to full calculator, default 'https://1fortheworld.org/impact-calculator')
 */

export default function SmallImpactWidget({
  learnMoreUrl = 'https://1fortheworld.org/impact-calculator'
}){
  const [salary, setSalary] = useState('')
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')

  // Parse numeric values or fall back to 0
  const salaryNum = parseFloat(salary.replace(/[^0-9.]/g, '')) || 0
  const currentAgeNum = parseInt(currentAge, 10) || 0
  const retirementAgeNum = parseInt(retirementAge, 10) || 0

  // Fixed defaults for small widget
  const donationRate = 0.01 // 1% donation rate
  const growthRate = 0.04   // 4% annual growth rate

  // Calculate results using lifetime inputs
  const { results } = useCalculatorInputs({
    salary: salaryNum,
    currentAge: currentAgeNum,
    retirementAge: retirementAgeNum,
    donationRate,
    growthRate,
    period: 'lifetime'
  })

  // Only show result once all fields are filled
  const showResult = salaryNum > 0 && currentAgeNum > 0 && retirementAgeNum > currentAgeNum

  return (
    <div className={styles.widgetBadge}>
      <input
        type="number"
        className={styles.input}
        placeholder="Annual salary"
        value={salary}
        onChange={e => setSalary(e.target.value)}
      />
      <input
        type="number"
        className={styles.input}
        placeholder="Current age"
        value={currentAge}
        onChange={e => setCurrentAge(e.target.value)}
      />
      <input
        type="number"
        className={styles.input}
        placeholder="Retirement age"
        value={retirementAge}
        onChange={e => setRetirementAge(e.target.value)}
      />

      {showResult && (
        <>  
          <div className={styles.value}>{results.livesSaved}</div>
          <div className={styles.label}>lives saved over your lifetime</div>
        </>
      )}

      <a href={learnMoreUrl} className={styles.link}>
        Learn more →
      </a>
    </div>
  )
};