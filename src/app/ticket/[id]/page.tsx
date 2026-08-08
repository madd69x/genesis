'use client';

import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import QRCode from 'react-qr-code';
import styles from './Ticket.module.css';

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Awesome Fresher';
  const ticketId = resolvedParams.id;

  // The QR code contains a JSON payload that can be scanned at the door
  const qrValue = JSON.stringify({
    id: ticketId,
    name: name,
    event: 'Genesis Freshers 2K26-27'
  });

  return (
    <div className={styles.container}>
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
          <h2 className={styles.attendeeName}>{name}</h2>
          
          <p className={styles.idLabel}>Ticket ID</p>
          <div className={styles.ticketId}>{ticketId.split('-')[0].toUpperCase()}</div>
        </div>

      </div>

      <button className={styles.printBtn} onClick={() => window.print()}>
        Download / Print
      </button>
    </div>
  );
}
