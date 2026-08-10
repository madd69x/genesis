import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc, getDocs, query, where, increment } from 'firebase/firestore';

// TODO: Replace this with the config provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCl5txedDRttQee_y664A0m69WJwIBQSuA",
  authDomain: "genesis-c7c31.firebaseapp.com",
  projectId: "genesis-c7c31",
  storageBucket: "genesis-c7c31.firebasestorage.app",
  messagingSenderId: "274221317865",
  appId: "1:274221317865:web:73b6606ce9310a9c3efa78"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Types
export interface TicketData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: 'Pending' | 'Verified';
  attended: boolean;
  createdAt: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  transactionId?: string;
}

// Helper: Generate random string
function generateCode(name: string) {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${suffix}`;
}

// Helper: Create a new ticket
export async function createTicket(data: Omit<TicketData, 'id' | 'paymentStatus' | 'attended' | 'createdAt' | 'referralCode' | 'referralsCount'>) {
  const ticketsRef = collection(db, 'tickets');
  
  // Create their unique referral code
  const referralCode = generateCode(data.name);

  const newTicket = {
    ...data,
    paymentStatus: 'Pending',
    attended: false,
    createdAt: Date.now(),
    referralCode,
    referralsCount: 0
  };

  const docRef = await addDoc(ticketsRef, newTicket);

  // If they used a referral code, find the owner and increment their count
  if (data.referredBy) {
    const q = query(ticketsRef, where("referralCode", "==", data.referredBy));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const referrerDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'tickets', referrerDoc.id), {
        referralsCount: increment(1)
      });
    }
  }

  return docRef.id;
}

// Helper: Submit Transaction ID for manual verification
export async function submitTransactionId(id: string, transactionId: string) {
  const docRef = doc(db, 'tickets', id);
  await updateDoc(docRef, {
    transactionId
  });
}

// Helper: Get a ticket by ID
export async function getTicket(id: string) {
  const docRef = doc(db, 'tickets', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as TicketData;
  }
  return null;
}

// Helper: Update payment status to Verified
export async function verifyPayment(id: string) {
  const docRef = doc(db, 'tickets', id);
  await updateDoc(docRef, {
    paymentStatus: 'Verified'
  });
}

// Helper: Mark as attended
export async function markAttended(id: string) {
  const docRef = doc(db, 'tickets', id);
  await updateDoc(docRef, {
    attended: true
  });
}

// Helper: Get all tickets (for Admin Dashboard)
export async function getAllTickets() {
  const ticketsRef = collection(db, 'tickets');
  const snapshot = await getDocs(ticketsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TicketData));
}

export { db };
