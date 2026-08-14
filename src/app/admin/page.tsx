'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { getAllTickets, verifyPayment, TicketData } from '../../lib/firebase';
import styles from './Admin.module.css';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    const data = await getAllTickets();
    // Sort by newest first
    setTickets(data.sort((a, b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchTickets();
    }
  }, [authenticated]);

  const handleVerify = async (id: string, email: string, name: string) => {
    if (confirm("Are you sure you want to verify this payment?")) {
      await verifyPayment(id);
      
      // Attempt to send email in the background
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, ticketId: id })
        });
      } catch (err) {
        console.error("Failed to trigger email", err);
      }

      setTickets(tickets.map(t => t.id === id ? { ...t, paymentStatus: 'Verified' } : t));
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>ORGANIZER LOGIN</h1>
          <input 
            type="password" 
            placeholder="Enter Password" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password === 'genesis2026') {
                setAuthenticated(true);
              }
            }}
          />
          <button 
            className={styles.refreshBtn}
            style={{marginTop: '1rem', width: '100%'}}
            onClick={() => {
              if (password === 'genesis2026') setAuthenticated(true);
              else alert('Incorrect Password');
            }}
          >
            LOGIN
          </button>
        </div>
      </div>
    );
  }

  const totalTickets = tickets.length;
  const verifiedCount = tickets.filter(t => t.paymentStatus === 'Verified').length;
  const attendedCount = tickets.filter(t => t.attended).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 className={styles.title}>GENESIS DASHBOARD</h1>
          <button onClick={() => setAuthenticated(false)} className={styles.refreshBtn}>Lock Panel</button>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statNum}>{totalTickets}</span>
            <span className={styles.statLabel}>Registered</span>
          </div>
          <div className={styles.statBox} style={{borderColor: '#00cc00'}}>
            <span className={styles.statNum}>{verifiedCount}</span>
            <span className={styles.statLabel}>Verified</span>
          </div>
          <div className={styles.statBox} style={{borderColor: 'var(--color-yellow)'}}>
            <span className={styles.statNum}>{attendedCount}</span>
            <span className={styles.statLabel}>Attended</span>
          </div>
        </div>
        <button className={styles.refreshBtn} onClick={fetchTickets}>REFRESH DATA</button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <h2 style={{textAlign: 'center', padding: '2rem'}}>LOADING...</h2>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>UTR / Trans ID</th>
                <th>Attended</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <React.Fragment key={ticket.id}>
                  <tr style={{cursor: 'pointer'}} onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id!)}>
                    <td style={{fontWeight: 'bold', color: 'var(--color-blue)', textDecoration: 'underline'}}>
                      {ticket.name} {ticket.age ? `(${ticket.age}, ${ticket.gender?.charAt(0)})` : ''} ⬇
                    </td>
                    <td>{ticket.phone}</td>
                    <td>
                      <span className={ticket.paymentStatus === 'Verified' ? styles.badgeGreen : styles.badgeRed}>
                        {ticket.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {ticket.transactionId ? (
                        <span style={{fontFamily: 'monospace', backgroundColor: '#eee', padding: '0.2rem'}}>{ticket.transactionId}</span>
                      ) : (
                        <span style={{color: '#999'}}>-</span>
                      )}
                    </td>
                    <td>
                      {ticket.attended ? '✅ Yes' : '❌ No'}
                    </td>
                    <td>
                      {ticket.paymentStatus === 'Pending' && (
                        <button 
                          className={styles.verifyBtn}
                          onClick={(e) => { e.stopPropagation(); handleVerify(ticket.id!, ticket.email, ticket.name); }}
                        >
                          Verify Payment
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === ticket.id && (
                    <tr style={{backgroundColor: '#f9f9f9'}}>
                      <td colSpan={6} style={{padding: '1rem', border: '2px dashed var(--color-blue)'}}>
                        <div style={{display: 'flex', gap: '2rem'}}>
                          <div>
                            <strong>Hobbies:</strong>
                            <p>{ticket.hobbies || 'N/A'}</p>
                          </div>
                          <div>
                            <strong>Party Requests:</strong>
                            <p>{ticket.partyRequests || 'None'}</p>
                          </div>
                          <div>
                            <strong>Referral Code:</strong>
                            <p>{ticket.referralCode} ({ticket.referralsCount} uses)</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
