// pages/api/interests.js
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const ref = doc(db, 'hikes', 'data'); // Firestore doc path: hikes/data

  if (req.method === 'GET') {
    const docSnap = await getDoc(ref);
    const data = docSnap.exists() ? docSnap.data() : { interests: {}, calendars: {} };
    res.status(200).json(data);
  }

  else if (req.method === 'POST') {
    const { key, name } = req.body;
    const docSnap = await getDoc(ref);
    const data = docSnap.exists() ? docSnap.data() : { interests: {}, calendars: {} };

    const updated = { ...data.interests };
    if (!updated[key]) updated[key] = [];
    if (!updated[key].includes(name)) updated[key].push(name);

    await setDoc(ref, { ...data, interests: updated });
    res.status(200).json({ success: true });
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
