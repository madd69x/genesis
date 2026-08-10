import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc, getDocs } from 'firebase/firestore';

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
}

// Helper: Create a new ticket
export async function createTicket(data: Omit<TicketData, 'id' | 'paymentStatus' | 'attended' | 'createdAt'>) {
  const ticketsRef = collection(db, 'tickets');
  const newTicket = {
    ...data,
    paymentStatus: 'Pending',
    attended: false,
    createdAt: Date.now()
  };
  const docRef = await addDoc(ticketsRef, newTicket);
  return docRef.id;
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
