// src/services/seedData.ts
import { db } from './firebase-node';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

// Exemplo criando dados para vários dias
async function seedData() {
  const days = [
    '2025-03-10',
    '2025-03-11',
    '2025-03-12',
    '2025-03-13',
    '2025-03-14',
    '2025-03-15',
    '2025-03-16',
  ];

  for (const day of days) {
    const good = Math.floor(Math.random() * 20);
    const regular = Math.floor(Math.random() * 20);
    const bad = Math.floor(Math.random() * 20);

    await setDoc(doc(db, 'evaluations', day), {
      date: day,
      goodCount: good,
      regularCount: regular,
      badCount: bad,
      comments: [],
      createdAt: Timestamp.now(),
    });
    console.log(`Dados criados para o dia ${day}`);
  }
}

// Chamada manual
seedData()
  .then(() => console.log('Seed finalizado'))
  .catch((err) => console.error(err));
