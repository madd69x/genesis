'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import styles from './TicketForm.module.css';

export default function TicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate a unique ticket ID
    const ticketId = uuidv4();

    // In a real app, we'd save this to a database. 
    // Here we just pass it via URL to the digital ticket page.
    const encodedName = encodeURIComponent(name);
    router.push(`/ticket/${ticketId}?name=${encodedName}`);
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
      <button type="submit" className={styles.submitBtn}>
        Buy Ticket - ₹1000
      </button>
    </form>
  );
}
