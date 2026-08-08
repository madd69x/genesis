'use client';
import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7, hours: 0, minutes: 0, seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fixed target for placeholder: 7 days from now
    const targetDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>TICKET DROP IN</h3>
      <div className={styles.timerGrid}>
        <div className={styles.timeBox}>
          <span className={styles.number}>{String(timeLeft.days).padStart(2, '0')}</span>
          <span className={styles.label}>DAYS</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className={styles.label}>HOURS</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.number}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className={styles.label}>MINS</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.number}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className={styles.label}>SECS</span>
        </div>
      </div>
    </div>
  );
}
