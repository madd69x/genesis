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

  useEffect(() => {
    async function fetchTicket() {
      const data = await getTicket(ticketId);
      setTicket(data);
      setLoading(false);
    }
    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return <div className={styles.container}><h2 style={{color:'white'}}>LOADING PASS...</h2></div>;
  }

  if (!ticket) {
    return <div className={styles.container}><h2 style={{color:'white'}}>TICKET NOT FOUND</h2></div>;
  }

  const isVerified = ticket.paymentStatus === 'Verified';

  // Admin verification link for the QR Code
  const qrValue = `https://genesis.vercel.app/admin/verify/${ticketId}`;

  // Actual UPI link for the payment screen
  const upiLink = `upi://pay?pa=7878463103@upi&pn=Genesis%20Party&am=1000&cu=INR&tn=Ticket-${ticketId}`;

  return (
    <div className={styles.container}>
      {!isVerified ? (
        <div className={styles.ticketCard} style={{ borderColor: 'var(--color-red)' }}>
          <div className={styles.header}>
            <h1 className={styles.partyName}>LOCKED PASS</h1>
            <p className={styles.subtitle}>Payment Pending</p>
          </div>
          
          <div className={styles.paymentInstructions}>
            <p style={{fontFamily: 'var(--font-display)', fontSize: '1.2rem'}}>Scan to Pay ₹1000 via UPI</p>
            <div className={styles.qrContainer} style={{ borderColor: 'var(--color-red)' }}>
              <QRCode value={upiLink} size={150} />
            </div>
            <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>
              After paying, show the screenshot to an Organizer to unlock your digital pass!
            </p>
            <p className={styles.idLabel}>Ticket ID for Reference:</p>
            <div className={styles.ticketId}>{ticketId}</div>
          </div>
        </div>
      ) : (
        <div className={styles.ticketCard}>
          <div className={styles.header}>
            <h1 className={styles.partyName}>GENESIS</h1>
            <p className={styles.subtitle}>Freshers' Welcome</p>
          </div>

          <div className={styles.qrContainer}>
            <QRCode 
              value={qrValue} 
              size={180}
              fgColor="#1a1a1a"
              bgColor="#ffffff"
              level="H"
            />
          </div>

          <div className={styles.details}>
            <p className={styles.nameLabel}>Admit One</p>
            <h2 className={styles.attendeeName}>{ticket.name}</h2>
            
            <p className={styles.idLabel}>Ticket ID</p>
            <div className={styles.ticketId}>{ticketId.split('-')[0].toUpperCase()}</div>
          </div>
        </div>
      )}

      {isVerified && (
        <button className={styles.printBtn} onClick={() => window.print()}>
          Download / Print
        </button>
      )}
    </div>
  );
}
