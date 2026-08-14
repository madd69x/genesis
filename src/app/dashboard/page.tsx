'use client';

import { use, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getTicketByUserId, submitTransactionId, TicketData, auth, onAuthStateChanged, signOut } from '../../lib/firebase';
import styles from './Dashboard.module.css';
import TicketForm from '../../components/TicketForm';

export default function DashboardPage() {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  const [utr, setUtr] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = '/';
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchTicket = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getTicketByUserId(user.uid);
    setTicket(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchTicket();
    }
  }, [authLoading, user]);

  const handleSubmitUtr = async () => {
    if (utr.length < 8) {
      alert("Please enter a valid 12-digit UTR/Transaction ID.");
      return;
    }
    setSubmittingUtr(true);
    try {
      await submitTransactionId(ticket!.id!, utr);
      alert("Transaction ID submitted successfully! We will verify it shortly.");
      setTicket({ ...ticket!, transactionId: utr });
    } catch (err) {
      console.error(err);
      alert("Failed to submit Transaction ID.");
    }
    setSubmittingUtr(false);
  };

  if (authLoading || (user && loading)) {
    return <div className={styles.container}><h2 style={{color:'white', fontFamily:'var(--font-display)'}}>LOADING DASHBOARD...</h2></div>;
  }

  // If user is null but authLoading is false, it means we are about to redirect. 
  // Return null to prevent a render crash while redirecting.
  if (!user) {
    return null;
  }

  // If user has no ticket, show the Ticket Registration Form
  if (!ticket) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', width: '100%', maxWidth: '800px' }}>
          <h1 style={{color:'var(--color-yellow)', fontFamily:'var(--font-display)', margin: 0}}>CREATE YOUR PROFILE</h1>
          <button onClick={() => signOut(auth)} style={{ padding: '0.5rem 1rem', background: 'var(--color-red)', color: 'white', border: '2px solid black', cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '4px solid black', maxWidth: '800px', width: '100%' }}>
          <TicketForm userId={user.uid} onSuccess={fetchTicket} />
        </div>
      </div>
    );
  }

  const isVerified = ticket.paymentStatus === 'Verified';
  
  // Use window.location.origin so the QR code works correctly on any domain (Vercel, localhost, etc)
  const [qrUrl, setQrUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined' && ticket) {
      setQrUrl(`${window.location.origin}/admin/verify/${ticket.id}`);
    }
  }, [ticket]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>MY DIGITAL PASS</h1>
        <button onClick={() => signOut(auth)} className={styles.logoutBtn}>LOGOUT</button>
      </div>

      <div className={styles.dashboardGrid}>
        
        {/* Left Column: QR & Payment */}
        <div className={`${styles.dashboardCard} ${styles.yellowCard}`}>
          <h2 className={styles.cardHeader}>ENTRY QR CODE</h2>
          <div className={styles.qrContainer}>
            {isVerified ? (
              <div className={styles.qrWrapper}>
                <QRCode value={qrUrl} size={200} />
                <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>SCAN TO ENTER</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                  <a href={qrUrl} target="_blank" rel="noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                    {qrUrl}
                  </a>
                </div>
              </div>
            ) : (
              <div className={styles.lockedQr}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ fontFamily: 'var(--font-display)' }}>QR LOCKED</h3>
                <p>Complete payment to unlock your digital pass.</p>
                <button 
                  className={styles.payNowBtn}
                  onClick={() => setShowPayment(!showPayment)}
                >
                  {showPayment ? 'Hide Payment Info' : 'PAY ₹1000 NOW'}
                </button>
              </div>
            )}
          </div>

          {showPayment && !isVerified && (
            <div className={styles.paymentSection}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem' }}>SCAN TO PAY (UPI)</h3>
              <div style={{ background: 'white', padding: '1rem', border: '2px solid black', borderRadius: '10px', display: 'inline-block', marginBottom: '1rem' }}>
                <QRCode value={`upi://pay?pa=7878463103@paytm&pn=Genesis&am=1000&cu=INR`} size={150} />
              </div>
              <p style={{ fontWeight: 'bold' }}>UPI: 7878463103@paytm</p>
              
              <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--color-black)', margin: '1rem 0' }}></div>

              <div style={{ textAlign: 'left' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Submit UTR / Transaction ID</h4>
                <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>After paying, enter the 12-digit UTR below.</p>
                
                <div style={{ marginBottom: '1rem', border: '2px dashed black', padding: '0.5rem', borderRadius: '5px' }}>
                  <Image src="/tutorial.jpg" alt="Where to find UTR" width={300} height={150} style={{width:'100%', height:'auto'}} />
                  <p style={{fontSize: '0.7rem', textAlign: 'center', marginTop: '0.5rem'}}>Example: Find the 12-digit UPI Ref No.</p>
                </div>

                <input 
                  type="text"
                  placeholder="e.g. 312345678901"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                  className={styles.utrInput}
                  maxLength={12}
                />
                <button 
                  className={styles.utrBtn}
                  onClick={handleSubmitUtr}
                  disabled={submittingUtr || !!ticket.transactionId}
                >
                  {submittingUtr ? 'Submitting...' : ticket.transactionId ? 'UTR Submitted' : 'Submit UTR'}
                </button>
                {ticket.transactionId && <p style={{color: 'green', fontWeight: 'bold', marginTop: '0.5rem'}}>Verification Pending...</p>}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details & Referral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className={styles.dashboardCard}>
            <h2 className={styles.cardHeader}>Profile Info</h2>
            <div className={styles.cardContent}>
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>Name:</span>
                <span className={styles.profileValue}>{ticket.name} ({ticket.age}, {ticket.gender})</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>Phone:</span>
                <span className={styles.profileValue}>{ticket.phone}</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>Status:</span>
                <span className={styles.profileValue} style={{ color: isVerified ? '#00cc00' : 'var(--color-red)' }}>{ticket.paymentStatus}</span>
              </div>
              
              <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--color-black)'}}>
                <p><strong>Hobbies:</strong> {ticket.hobbies || 'N/A'}</p>
                <p><strong>Party Requests:</strong> {ticket.partyRequests || 'None'}</p>
              </div>
            </div>
          </div>

          <div className={styles.dashboardCard}>
            <h2 className={styles.cardHeader}>Refer & Earn</h2>
            <div className={styles.cardContent}>
              <p>Invite 10 friends and your ticket is FREE!</p>
              
              <div className={styles.referralBox}>
                <span className={styles.referralCode}>{ticket.referralCode}</span>
                <button 
                  className={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(ticket.referralCode);
                    alert("Copied to clipboard!");
                  }}
                >
                  COPY
                </button>
              </div>
              
              <div className={styles.referralStats}>
                <span>Friends Joined:</span>
                <span className={styles.statHighlight}>{ticket.referralsCount || 0} / 10</span>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${Math.min(((ticket.referralsCount || 0) / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
