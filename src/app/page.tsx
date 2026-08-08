'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import styles from './page.module.css';
import TicketForm from '../components/TicketForm';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effects
  const glassY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const glassRotate = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  
  const featuresY = useTransform(scrollYProgress, [0, 0.5], ['50%', '0%']);
  const featuresOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <main className={styles.container} ref={containerRef}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.titleGroup}
          style={{ y: titleY }}
        >
          <h1 className={styles.mainTitle}>Freshers'</h1>
          <h2 className={styles.subTitle}>Welcome</h2>
          <div className={styles.partyWord}>Party</div>
          <div className={styles.year}>2K26-27</div>
          <h3 className={styles.genesisTitle}>GENESIS</h3>
          <p className={styles.genesisSub}>THE REAL FUN BEGINS</p>
        </motion.div>

        <motion.div 
          className={styles.glassImage}
          style={{ y: glassY, rotate: glassRotate }}
        >
          <Image 
            src="/glass.jpg" 
            alt="Cocktail Glass" 
            width={400} 
            height={400} 
            priority
            style={{ width: '100%', height: 'auto', borderRadius: '20px' }}
          />
        </motion.div>
      </section>

      {/* Info Section */}
      <section className={styles.infoSection}>
        <motion.ul 
          className={styles.featuresList}
          style={{ y: featuresY, opacity: featuresOpacity }}
        >
          <motion.li className={styles.featureItem} whileHover={{ scale: 1.1, originX: 1 }}>✨ NEW FRIENDS!</motion.li>
          <motion.li className={styles.featureItem} whileHover={{ scale: 1.1, originX: 1 }}>🎧 LIVE DJ!!</motion.li>
          <motion.li className={styles.featureItem} whileHover={{ scale: 1.1, originX: 1 }}>🎯 FUN GAMES!!!</motion.li>
          <motion.li className={styles.featureItem} whileHover={{ scale: 1.1, originX: 1 }}>📸 PHOTO BOOOTHS!!</motion.li>
          <motion.li className={styles.featureItem} whileHover={{ scale: 1.1, originX: 1 }}>🍔 GOOOOOD FOOD!!</motion.li>
          <motion.li className={styles.featureItem} whileHover={{ scale: 1.1, originX: 1 }}>😎 Good vibes ofc..</motion.li>
        </motion.ul>
      </section>

      {/* Event Details */}
      <section className={styles.detailsSection}>
        <h2 className={styles.detailsTitle}>The Details</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <span className={styles.detailLabel}>When</span>
            <span className={styles.detailText}>Saturday, October 24th<br/>4:00 PM Onwards</span>
          </div>
          <div className={styles.detailCard}>
            <span className={styles.detailLabel}>Where</span>
            <span className={styles.detailText}>The Grand Hall<br/>University Campus</span>
          </div>
          <div className={styles.detailCard}>
            <span className={styles.detailLabel}>Dress Code</span>
            <span className={styles.detailText}>Retro / Pop-Art / Colorful<br/>Dress to impress!</span>
          </div>
        </div>
      </section>

      {/* Ticket Booking Section */}
      <section className={styles.ticketSection}>
        <h2 className={styles.ticketTitle}>GET YOUR TICKET</h2>
        <TicketForm />
      </section>

      <footer className={styles.footer}>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.instagramLink}>
          <Instagram size={32} />
          <span>@genesis.freshers</span>
        </a>
      </footer>

    </main>
  );
}
