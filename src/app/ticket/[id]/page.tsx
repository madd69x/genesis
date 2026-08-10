'use client';

import { use, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getTicket, submitTransactionId, TicketData, auth, onAuthStateChanged, ADMIN_EMAILS } from '../../../lib/firebase';
import styles from './Ticket.module.css';

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

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
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    async function fetchTicket() {
      const data = await getTicket(ticketId);
      setTicket(data);
      setLoading(false);
    }
    fetchTicket();
  }, [ticketId, authLoading]);

  const handleSubmitUtr = async () => {
    if (utr.length < 8) {
      alert("Please enter a valid Transaction ID / UTR");
      return;
    }
    setSubmittingUtr(true);
    try {
      await submitTransactionId(ticketId, utr);
      setTicket(prev => prev ? { ...prev, transactionId: utr } : null);
    } catch (e) {
      alert("Failed to submit. Try again.");
    }
    setSubmittingUtr(false);
  };

  if (loading || authLoading) {
    return <div className={styles.container}><h2 style={{color:'white'}}>LOADING...</h2></div>;
  }

  if (!ticket) {
    return <div className={styles.container}><h2 style={{color:'white'}}>PROFILE NOT FOUND</h2></div>;
  }

  if (!user || (ticket.userId !== user.uid && !ADMIN_EMAILS.includes(user.email))) {
    return (
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{color: 'var(--color-red)', fontFamily: 'var(--font-display)', marginBottom: '1rem'}}>ACCESS DENIED</h1>
        <p style={{color: 'white', marginBottom: '2rem'}}>You must be logged in as the owner to view this ticket.</p>
        <button onClick={() => router.push('/')} style={{ padding: '1rem', backgroundColor: 'var(--color-yellow)', border: '4px solid black', fontWeight: 'bold', cursor: 'pointer' }}>
          GO TO LOGIN
        </button>
      </div>
    );
  }

  const isVerified = ticket.paymentStatus === 'Verified';

  // Admin verification link for the QR Code
  const qrValue = `https://genesis.vercel.app/admin/verify/${ticketId}`;

  // Actual UPI link for the payment screen
  const upiLink = `upi://pay?pa=7878463103@upi&pn=Genesis%20Party&am=1000&cu=INR&tn=Ticket-${ticketId}`;

  return (
    <div className={styles.container}>
      <h1 className={styles.dashboardTitle}>YOUR DASHBOARD</h1>

      <div className={styles.dashboardGrid}>
        {/* PROFILE SECTION */}
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardHeader}>Profile Info</h2>
          <div className={styles.cardContent}>
            <p><strong>Name:</strong> {ticket.name} ({ticket.age}, {ticket.gender})</p>
            <p><strong>Phone:</strong> {ticket.phone}</p>
            <p><strong>Status:</strong> <span style={{ color: isVerified ? '#00cc00' : 'var(--color-red)', fontWeight: 'bold'}}>{ticket.paymentStatus}</span></p>
            
            <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #ccc'}}>
              <p><strong>Hobbies:</strong> {ticket.hobbies || 'N/A'}</p>
              <p><strong>Party Requests:</strong> {ticket.partyRequests || 'None'}</p>
            </div>
          </div>
        </div>

        {/* REFERRAL SECTION */}
        <div className={styles.dashboardCard} style={{ borderColor: 'var(--color-orange)' }}>
          <h2 className={styles.cardHeader} style={{ backgroundColor: 'var(--color-orange)' }}>Referral Program</h2>
          <div className={styles.cardContent}>
            <p style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-red)'}}>
              BRING 10 PEOPLE, GET YOUR TICKET FREE!
            </p>
            <p style={{marginTop: '1rem'}}>Share this code with your friends:</p>
            <div className={styles.referralCode}>{ticket.referralCode}</div>
            
            <div className={styles.referralStats}>
              <span className={styles.statCount}>{ticket.referralsCount}</span>
              <span>Friends Referred</span>
            </div>
          </div>
        </div>

        {/* TICKET/PAYMENT SECTION */}
        <div className={styles.dashboardCard} style={{ gridColumn: '1 / -1' }}>
          <h2 className={styles.cardHeader} style={{ backgroundColor: isVerified ? '#00cc00' : 'var(--color-black)' }}>
            Digital Pass
          </h2>
          
          <div className={styles.cardContent} style={{ alignItems: 'center' }}>
            {!isVerified ? (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-red)'}}>LOCKED</h3>
                <p>You must pay ₹1000 to unlock your pass.</p>
                
                {!showPayment ? (
                  <button className={styles.unlockBtn} onClick={() => setShowPayment(true)}>
                    UNLOCK PASS NOW
                  </button>
                ) : ticket.transactionId ? (
                  <div className={styles.paymentInstructions} style={{borderColor: 'var(--color-yellow)'}}>
                    <h3 style={{fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-yellow)'}}>VERIFICATION PENDING</h3>
                    <p style={{marginTop: '1rem'}}>You submitted UTR: <strong>{ticket.transactionId}</strong></p>
                    <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>
                      An organizer is currently verifying your payment. Refresh this page in a few minutes!
                    </p>
                  </div>
                ) : (
                  <div className={styles.paymentInstructions}>
                    <p style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem'}}>1. Scan to Pay via UPI</p>
                    <div className={styles.qrContainer} style={{ borderColor: 'var(--color-red)', margin: '1rem auto' }}>
                      <QRCode value={upiLink} size={150} />
                    </div>
                    
                    <div className={styles.utrSection}>
                      <p style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginTop: '1rem'}}>2. Find your Transaction ID (UTR)</p>
                      
                      <div style={{ position: 'relative', width: '100%', maxWidth: '300px', height: '200px', margin: '1rem auto', border: '3px solid var(--color-black)' }}>
                        <Image src="/tutorial.jpg" alt="UPI Tutorial" fill style={{objectFit: 'cover'}} />
                      </div>

                      <p style={{fontSize: '0.9rem', marginBottom: '1rem'}}>
                        Look for a 12-digit number (UTR) on your payment receipt.
                      </p>
                      
                      <input 
                        type="text" 
                        placeholder="Enter 12-digit UTR"
                        className={styles.utrInput}
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                      />
                      <button 
                        className={styles.submitUtrBtn} 
                        onClick={handleSubmitUtr}
                        disabled={submittingUtr}
                      >
                        {submittingUtr ? 'SUBMITTING...' : 'SUBMIT PROOF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#00cc00', marginBottom: '1rem'}}>UNLOCKED</h3>
                <div className={styles.qrContainer}>
                  <QRCode 
                    value={qrValue} 
                    size={200}
                    fgColor="#1a1a1a"
                    bgColor="#ffffff"
                    level="H"
                  />
                </div>
                <p className={styles.idLabel}>Show this QR at the entrance</p>
                
                <button className={styles.printBtn} onClick={() => window.print()}>
                  Download / Print
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
