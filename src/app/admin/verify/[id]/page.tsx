'use client';

import { use, useEffect, useState } from 'react';
import { getTicket, markAttended, TicketData } from '../../../../lib/firebase';
import styles from './Verify.module.css';

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      const data = await getTicket(ticketId);
      setTicket(data);
      setLoading(false);
    }
    fetchTicket();
  }, [ticketId]);

  const handleAdmit = async () => {
    if (!ticket) return;
    const confirm = window.confirm(`Admit ${ticket.name}? This will mark their pass as used.`);
    if (confirm) {
      setAttending(true);
      await markAttended(ticketId);
      setTicket({ ...ticket, attended: true });
      setAttending(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><h2 style={{color:'white'}}>FETCHING RECORD...</h2></div>;
  }

  if (!ticket) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ borderColor: 'var(--color-red)' }}>
          <h1 className={styles.alertText}>INVALID PASS</h1>
          <p>No record found for this QR code.</p>
        </div>
      </div>
    );
  }

  if (ticket.paymentStatus === 'Pending') {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ borderColor: 'var(--color-red)' }}>
          <h1 className={styles.alertText}>PAYMENT PENDING</h1>
          <h2 className={styles.name}>{ticket.name}</h2>
          <p>Phone: {ticket.phone}</p>
          <div className={styles.stopBox}>DO NOT ADMIT</div>
        </div>
      </div>
    );
  }

  if (ticket.attended) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ borderColor: 'var(--color-orange)' }}>
          <h1 className={styles.alertText} style={{ color: 'var(--color-orange)' }}>ALREADY USED</h1>
          <h2 className={styles.name}>{ticket.name}</h2>
          <p>Phone: {ticket.phone}</p>
          <div className={styles.stopBox} style={{ backgroundColor: 'var(--color-orange)' }}>DUPLICATE SCAN</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ borderColor: 'var(--color-yellow)' }}>
        <h1 className={styles.alertText} style={{ color: '#00cc00' }}>VERIFIED</h1>
        <h2 className={styles.name}>{ticket.name}</h2>
        <p>Phone: {ticket.phone}</p>
        
        <button 
          className={styles.admitBtn} 
          onClick={handleAdmit}
          disabled={attending}
        >
          {attending ? "MARKING..." : "MARK AS ATTENDED"}
        </button>
      </div>
    </div>
  );
}
