import styles from './Marquee.module.css';

export default function Marquee() {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        <span>GENESIS 2K26-27 • FRESHERS WELCOME • LIMITED TICKETS • GRAB YOURS NOW • </span>
        <span>GENESIS 2K26-27 • FRESHERS WELCOME • LIMITED TICKETS • GRAB YOURS NOW • </span>
        <span>GENESIS 2K26-27 • FRESHERS WELCOME • LIMITED TICKETS • GRAB YOURS NOW • </span>
        <span>GENESIS 2K26-27 • FRESHERS WELCOME • LIMITED TICKETS • GRAB YOURS NOW • </span>
      </div>
    </div>
  );
}
