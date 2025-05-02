// pages/api/calendar.js
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { key, date } = req.body;
    const ref = doc(db, 'hikes', 'data');
    const docSnap = await getDoc(ref);
    const data = docSnap.exists() ? docSnap.data() : { interests: {}, calendars: {} };

    const updatedCalendars = { ...data.calendars, [key]: date };

    await setDoc(ref, { ...data, calendars: updatedCalendars });
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
