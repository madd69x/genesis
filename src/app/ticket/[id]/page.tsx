'use client';

import { use, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { getTicket, TicketData } from '../../../lib/firebase';
import styles from './Ticket.module.css';

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      const data = await getTicket(ticketId);
      setTicket(data);
      setLoading(false);
    }
    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return <div className={styles.container}><h2 style={{color:'white'}}>LOADING PROFILE...</h2></div>;
  }

  if (!ticket) {
    return <div className={styles.container}><h2 style={{color:'white'}}>PROFILE NOT FOUND</h2></div>;
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
            <p><strong>Name:</strong> {ticket.name}</p>
            <p><strong>Phone:</strong> {ticket.phone}</p>
            <p><strong>Status:</strong> <span style={{ color: isVerified ? '#00cc00' : 'var(--color-red)'}}>{ticket.paymentStatus}</span></p>
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
                ) : (
                  <div className={styles.paymentInstructions}>
                    <p style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem'}}>Scan to Pay via UPI</p>
                    <div className={styles.qrContainer} style={{ borderColor: 'var(--color-red)', margin: '1rem auto' }}>
                      <QRCode value={upiLink} size={150} />
                    </div>
                    <p style={{fontSize: '0.9rem'}}>
                      After paying, show the screenshot to an Organizer to verify your pass!
                    </p>
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
