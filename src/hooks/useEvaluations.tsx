// src/hooks/useEvaluations.tsx
import { db } from '../services/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import moment from 'moment';

interface Comment {
  userId: string;
  text: string;
  createdAt: number;
  replies?: Comment[];
}

interface DailyEvaluation {
  id: string;
  date: string;
  goodCount: number;
  regularCount: number;
  badCount: number;
  comments: Comment[];
}

export const useEvaluations = () => {
  const [dailyData, setDailyData] = useState<DailyEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const todayId = moment().format('YYYY-MM-DD');

  const loadTodayEvaluations = async () => {
    setLoading(true);
    const docRef = doc(db, 'evaluations', todayId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDailyData({ id: docSnap.id, ...docSnap.data() } as DailyEvaluation);
    } else {
      await setDoc(docRef, {
        date: todayId,
        goodCount: 0,
        regularCount: 0,
        badCount: 0,
        comments: [],
        createdAt: Timestamp.now(),
      });
      setDailyData({ id: todayId, date: todayId, goodCount: 0, regularCount: 0, badCount: 0, comments: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTodayEvaluations();
  }, []);

  const registerEvaluation = async (type: 'good' | 'regular' | 'bad') => {
    if (!dailyData) return;
    const docRef = doc(db, 'evaluations', dailyData.id);
    await updateDoc(docRef, { [`${type}Count`]: dailyData[`${type}Count`] + 1 });
    setDailyData((prev) => prev && { ...prev, [`${type}Count`]: prev[`${type}Count`] + 1 });
  };

  const addComment = async (userId: string, text: string) => {
    if (!dailyData) return;
    const docRef = doc(db, 'evaluations', dailyData.id);
    const newComment: Comment = { userId, text, createdAt: new Date().getTime(), replies: [] };
    await updateDoc(docRef, { comments: arrayUnion(newComment) });
    loadTodayEvaluations();
  };

  const fetchEvaluationsByRange = async (start: string, end: string, collectionName: string = 'evaluations') => {
    const evaluationsQuery = query(
      collection(db, collectionName),
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date', 'asc') // Ordenação opcional
    );

    const querySnapshot = await getDocs(evaluationsQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  return { dailyData, loading, registerEvaluation, addComment, fetchEvaluationsByRange };
};
