'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import TicketForm from '../components/TicketForm';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll across the massive scrollTrack container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- PHASE 1: HERO (0 to 0.2) ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const heroZ = useTransform(scrollYProgress, [0, 0.2], [0, -500]);

  // --- THE GLASS (Moves continuously across phases) ---
  // Starts centered, then shrinks and moves to the top right corner
  const glassX = useTransform(scrollYProgress, [0, 0.2, 0.4], ['0%', '150%', '150%']);
  const glassY = useTransform(scrollYProgress, [0, 0.2, 0.4], ['0%', '-50%', '-50%']);
  const glassScale = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.4, 0.4]);
  const glassRotate = useTransform(scrollYProgress, [0, 0.2, 1], [-15, 10, 45]);

  // --- PHASE 2: INTRO (0.15 to 0.4) ---
  const introOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], ['50%', '0%', '0%', '-50%']);

  // --- PHASE 3: ITINERARY & FAQ (0.3 to 1.0) ---
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.9, 1], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0.3, 0.4], ['50%', '0%']);
  
  // Floating Assets for Phase 3
  const boomboxX = useTransform(scrollYProgress, [0.3, 0.8], ['-150%', '5%']);
  const boomboxY = useTransform(scrollYProgress, [0.3, 0.8], ['80%', '20%']);
  const boomboxRotate = useTransform(scrollYProgress, [0.3, 0.8], [-45, 15]);

  const discoX = useTransform(scrollYProgress, [0.3, 0.8], ['150%', '-5%']);
  const discoY = useTransform(scrollYProgress, [0.3, 0.8], ['-50%', '10%']);
  const discoScale = useTransform(scrollYProgress, [0.3, 0.8], [0.5, 1]);

  return (
    <main className={styles.container}>
      
      {/* STICKY SCROLL TRACK */}
      <div className={styles.scrollTrack} ref={containerRef}>
        <div className={styles.stickyContainer}>

          {/* SCENE 1: HERO */}
          <motion.div className={styles.scene} style={{ opacity: heroOpacity, scale: heroScale, z: heroZ }}>
            <div className={styles.titleGroup}>
              <h1 className={styles.mainTitle}>Freshers'</h1>
              <h2 className={styles.subTitle}>Welcome</h2>
              <div className={styles.partyWord}>Party</div>
              <div className={styles.year}>2K26-27</div>
              <h3 className={styles.genesisTitle}>GENESIS</h3>
              <p className={styles.genesisSub}>THE REAL FUN BEGINS</p>
            </div>
          </motion.div>

          {/* PERSISTENT 3D ASSET: THE GLASS */}
          <div className={styles.glassContainer}>
            <motion.div 
              style={{ x: glassX, y: glassY, scale: glassScale, rotate: glassRotate }}
              className={styles.glassImage}
            >
              <Image src="/glass.jpg" alt="Cocktail Glass" width={400} height={400} priority style={{ width: '100%', height: 'auto', borderRadius: '20px' }} />
            </motion.div>
          </div>

          {/* SCENE 2: INTRO */}
          <motion.div className={styles.scene} style={{ opacity: introOpacity, y: introY }}>
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>Get ready to pop, drop, and roll into the best years of your life! 🍹💥</h2>
              <p className={styles.introText}>
                Welcome to GENESIS — the unofficial Freshers' Welcome Party for the batch of 2K26-27 of MBM University Jodhpur! The real fun begins NOW. 🥂
              </p>
            </div>
          </motion.div>

          {/* SCENE 3: FLOATING ASSETS (Boombox & Disco Ball) */}
          <motion.div className={styles.scene} style={{ opacity: contentOpacity }}>
            <motion.div className={styles.floatingAsset} style={{ x: boomboxX, y: boomboxY, rotate: boomboxRotate, left: 0, top: 0 }}>
              <Image src="/boombox.jpg" alt="Retro Boombox" width={300} height={300} style={{ width: '100%', height: 'auto', borderRadius: '15px' }} />
            </motion.div>
            <motion.div className={styles.floatingAsset} style={{ x: discoX, y: discoY, scale: discoScale, right: 0, top: '20%' }}>
              <Image src="/disco.jpg" alt="Disco Ball" width={300} height={300} style={{ width: '100%', height: 'auto', borderRadius: '50%' }} />
            </motion.div>
          </motion.div>

          {/* SCENE 4: ITINERARY & FAQ */}
          <motion.div className={styles.scene} style={{ opacity: contentOpacity, y: contentY }}>
            <div className={styles.contentGrid}>
              
              {/* Itinerary */}
              <div className={styles.sectionBox}>
                <h3 className={styles.sectionTitle}>The Plan</h3>
                <div className={styles.timeline}>
                  <div className={styles.timeSlot}>
                    <span className={styles.time}>3:30 PM</span>
                    <span className={styles.event}>Doors Open & Welcome Drinks</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.time}>4:30 PM</span>
                    <span className={styles.event}>Ice Breakers & Fun Games 🎯</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.time}>6:00 PM</span>
                    <span className={styles.event}>Live DJ Set Begins 🎧</span>
                  </div>
                  <div className={styles.timeSlot}>
                    <span className={styles.time}>8:00 PM</span>
                    <span className={styles.event}>Dinner is Served 🍕</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className={styles.sectionBox}>
                <h3 className={styles.sectionTitle}>Rules & FAQs</h3>
                <div className={styles.faqList}>
                  <div className={styles.faqItem}>
                    <span className={styles.question}>Can Hostelers attend?</span>
                    <span className={styles.answer}>Yes! The party is in the afternoon, so there are no curfew issues for hostelers.</span>
                  </div>
                  <div className={styles.faqItem}>
                    <span className={styles.question}>Is alcohol allowed?</span>
                    <span className={styles.answer}>Strictly NO alcohol. Only good food and good vibes! ✨</span>
                  </div>
                  <div className={styles.faqItem}>
                    <span className={styles.question}>What is the dress code?</span>
                    <span className={styles.answer}>Everything that feels dressed up right. Retro, Pop-Art, or just dress to impress!</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* TICKET SECTION (Normal Scroll Flow) */}
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
