'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket } from '../lib/firebase';
import styles from './TicketForm.module.css';

export default function TicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [partyRequests, setPartyRequests] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    try {
      const ticketData: any = {
        name,
        email,
        phone,
        age: parseInt(age, 10),
        gender,
        hobbies,
        partyRequests
      };
      
      if (referredBy.trim()) {
        ticketData.referredBy = referredBy.trim().toUpperCase();
      }

      // Save to Firebase Database
      const ticketId = await createTicket(ticketData);
      
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
        <label htmlFor="email" className={styles.label}>Email *</label>
        <input 
          id="email"
          type="email" 
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="For notifications"
          required
        />
      </div>

      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-black)', margin: '1rem 0' }}></div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>ABOUT YOU</h3>

      <div className={styles.inputGroup}>
        <label htmlFor="age" className={styles.label}>Age *</label>
        <input 
          id="age"
          type="number" 
          className={styles.input}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 18"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="gender" className={styles.label}>Gender *</label>
        <select 
          id="gender"
          className={styles.input}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled>Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="hobbies" className={styles.label}>Hobbies & Interests *</label>
        <input 
          id="hobbies"
          type="text" 
          className={styles.input}
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="Music, Dancing, Gaming..."
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="partyRequests" className={styles.label}>Party Requests *</label>
        <textarea 
          id="partyRequests"
          className={styles.input}
          value={partyRequests}
          onChange={(e) => setPartyRequests(e.target.value)}
          placeholder="What do you want added? E.g., specific songs, food, games?"
          required
          style={{ minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-black)', margin: '1rem 0' }}></div>

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
