'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '../lib/firebase';
import styles from './TicketForm.module.css';

export default function TicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    try {
      // Save to Firebase Database
      const ticketId = await createTicket({
        name,
        email,
        phone,
        referredBy: referredBy.trim() ? referredBy.trim().toUpperCase() : undefined
      });
      
      // Redirect to their unique digital pass page to complete payment
      router.push(`/ticket/${ticketId}`);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.priceTag}>Price: ₹1000 / Person</div>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Your Name</label>
        <input 
          id="name"
          type="text" 
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. John Doe"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="phone" className={styles.label}>Phone Number</label>
        <input 
          id="phone"
          type="tel" 
          className={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="e.g. 9876543210"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Email (Optional)</label>
        <input 
          id="email"
          type="email" 
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="For notifications"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="referral" className={styles.label}>Referral Code (Optional)</label>
        <input 
          id="referral"
          type="text" 
          className={styles.input}
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          placeholder="Did a friend invite you?"
          style={{ textTransform: 'uppercase' }}
        />
      </div>
      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "CREATING PROFILE..." : "GET PASS - ₹1000"}
      </button>
    </form>
  );
}
