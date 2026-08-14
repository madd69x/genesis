'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../lib/firebase';
import Countdown from '../components/Countdown';
import Marquee from '../components/Marquee';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push('/dashboard');
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  return (
    <main className={styles.container}>
      
      {/* HERO SECTION */}
      <motion.section 
        className={styles.hero}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.staticGlass}>
          <Image src="/glass.jpg" alt="Cocktail Glass" width={400} height={400} priority style={{ width: '100%', height: 'auto', borderRadius: '20px' }} />
        </div>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>Freshers'</h1>
          <h2 className={styles.subTitle}>Welcome</h2>
          <div className={styles.partyWord}>Party</div>
          <div className={styles.year}>2K26-27</div>
          <h3 className={styles.genesisTitle}>GENESIS</h3>
          <p className={styles.genesisSub}>THE REAL FUN BEGINS</p>
        </div>
      </motion.section>

      {/* COUNTDOWN SECTION */}
      <Countdown />

      {/* INTRO SECTION (with static floating Boombox) */}
      <motion.section 
        className={styles.introSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.introContent}>
          <motion.div 
            className={styles.staticBoombox}
            initial={{ x: -200, opacity: 0, rotate: -45 }}
            whileInView={{ x: 0, opacity: 1, rotate: -15 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            viewport={{ once: false, margin: "-10%" }}
          >
            <Image src="/boombox.jpg" alt="Retro Boombox" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: '15px' }} />
          </motion.div>
          <h2 className={styles.introTitle}>Get ready to pop, drop, and roll into the best years of your life!</h2>
          <p className={styles.introText}>
            Welcome to GENESIS — the unofficial Freshers' Welcome Party for the batch of 2K26-27 of MBM University Jodhpur! The real fun begins NOW.
          </p>
        </div>
      </motion.section>

      {/* MARQUEE BANNER */}
      <Marquee />

      {/* ITINERARY & FAQ SCENE (with static floating Disco ball) */}
      <motion.section 
        className={styles.detailsSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.contentGrid}>
          
          {/* Itinerary */}
          <div className={styles.sectionBox} style={{ position: 'relative' }}>
            <h3 className={styles.sectionTitle}>The Plan</h3>
            <div className={styles.timeline}>
              <div className={styles.timeSlot}>
                <span className={styles.time}>10:00 AM</span>
                <span className={styles.event}>Doors Open & Welcome Drinks</span>
              </div>
              <div className={styles.timeSlot}>
                <span className={styles.time}>11:30 AM</span>
                <span className={styles.event}>Ice Breakers & Fun Games</span>
              </div>
              <div className={styles.timeSlot}>
                <span className={styles.time}>1:30 PM</span>
                <span className={styles.event}>Live DJ Set Begins</span>
              </div>
              <div className={styles.timeSlot}>
                <span className={styles.time}>3:30 PM</span>
                <span className={styles.event}>Late Lunch / Dinner is Served</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className={styles.sectionBox} style={{ position: 'relative' }}>
            <motion.div 
              className={styles.staticDisco}
              initial={{ x: 200, opacity: 0, scale: 0.5, rotate: -45 }}
              whileInView={{ x: 0, opacity: 1, scale: 1, rotate: 15 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              viewport={{ once: false, margin: "-10%" }}
            >
              <Image src="/disco.jpg" alt="Disco Ball" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: '50%' }} />
            </motion.div>
            <h3 className={styles.sectionTitle}>Rules & FAQs</h3>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <span className={styles.question}>Can Hostelers attend?</span>
                <span className={styles.answer}>Yes! The party is in the afternoon, so there are no curfew issues for hostelers.</span>
              </div>
              <div className={styles.faqItem}>
                <span className={styles.question}>Is alcohol allowed?</span>
                <span className={styles.answer}>Strictly NO alcohol. Only good food and good vibes!</span>
              </div>
              <div className={styles.faqItem}>
                <span className={styles.question}>What is the dress code?</span>
                <span className={styles.answer}>Everything that feels dressed up right. Retro, Pop-Art, or just dress to impress!</span>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* AUTH SECTION (Footer) */}
      <motion.section 
        className={styles.ticketSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.8 }}
      >
        {authLoading ? (
          <p style={{textAlign: 'center', color: 'white', fontFamily: 'var(--font-display)'}}>LOADING...</p>
        ) : (
          <div style={{ backgroundColor: 'var(--color-yellow)', padding: '2rem', border: '4px solid black', maxWidth: '500px', margin: '0 auto', boxShadow: '8px 8px 0px black' }}>
            <h2 className={styles.ticketTitle} style={{ color: 'black' }}>{isLoginMode ? 'LOGIN TO ENTER' : 'CREATE ACCOUNT'}</h2>
            {authError && <p style={{color: 'red', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center'}}>{authError}</p>}
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" style={{ padding: '1rem', border: '3px solid black' }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" style={{ padding: '1rem', border: '3px solid black' }} />
              <button type="submit" style={{ padding: '1rem', backgroundColor: 'black', color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>{isLoginMode ? 'LOGIN' : 'SIGN UP'}</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline', color: 'black' }} onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? "Don't have an account? Sign up here." : "Already have an account? Login here."}
            </p>
          </div>
        )}
      </motion.section>

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
