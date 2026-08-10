'use client';

import { useEffect, useState } from 'react';
import { getAllTickets, verifyPayment, TicketData } from '../../lib/firebase';
import styles from './Admin.module.css';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  // Simple "security" - in a real app, use proper Auth
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

  const handleVerify = async (id: string) => {
    const confirm = window.confirm('Verify payment for this user?');
    if (confirm) {
      await verifyPayment(id);
      fetchTickets(); // Refresh list
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
              // Just a dummy password for this demo
              if (e.key === 'Enter' && password === 'genesisadmin') {
                setAuthenticated(true);
              }
            }}
          />
          <p style={{fontSize:'0.8rem', marginTop:'1rem', color:'#666'}}>Password is "genesisadmin"</p>
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
        <h1 className={styles.title}>GENESIS DASHBOARD</h1>
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
                <th>Attended</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={{fontWeight: 'bold'}}>{ticket.name}</td>
                  <td>{ticket.phone}</td>
                  <td>
                    <span className={ticket.paymentStatus === 'Verified' ? styles.badgeGreen : styles.badgeRed}>
                      {ticket.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {ticket.attended ? '✅ Yes' : '❌ No'}
                  </td>
                  <td>
                    {ticket.paymentStatus === 'Pending' && (
                      <button 
                        className={styles.verifyBtn}
                        onClick={() => handleVerify(ticket.id!)}
                      >
                        Verify Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
