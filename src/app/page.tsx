'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import TicketForm from '../components/TicketForm';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Enhanced 3D Parallax effects
  // Glass moves significantly and rotates in 3D space
  const glassY = useTransform(scrollYProgress, [0, 0.5], ['0%', '150%']);
  const glassRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 45]);
  const glassRotateY = useTransform(scrollYProgress, [0, 0.5], [-15, 30]);
  const glassScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const glassZ = useTransform(scrollYProgress, [0, 0.5], [0, 200]);

  // Title pushes back into the distance
  const titleY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-80%']);
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const titleZ = useTransform(scrollYProgress, [0, 0.5], [0, -300]);
  
  const featuresY = useTransform(scrollYProgress, [0, 0.5], ['50%', '0%']);
  const featuresOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <main className={styles.container} ref={containerRef}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.titleGroup}
          style={{ y: titleY, scale: titleScale, z: titleZ }}
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
          style={{ y: glassY, rotateX: glassRotateX, rotateY: glassRotateY, scale: glassScale, z: glassZ }}
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

      {/* Intro Section */}
      <section className={styles.introSection}>
        <h2 className={styles.introTitle}>Get ready to pop, drop, and roll into the best years of your life! 🍹💥</h2>
        <p className={styles.introText}>
          Welcome to GENESIS — the unofficial Freshers' Welcome Party for the batch of 2K26-27 of MBM University Jodhpur! The real fun begins NOW. 🥂
        </p>
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
            <span className={styles.detailText}>To be revealed soon!</span>
          </div>
          <div className={styles.detailCard}>
            <span className={styles.detailLabel}>Where</span>
            <span className={styles.detailText}>To be revealed soon!</span>
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
        <a href="https://www.instagram.com/genesis2026__/" target="_blank" rel="noopener noreferrer" className={styles.instagramLink}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>@genesis2026__</span>
        </a>
      </footer>

    </main>
  );
}
