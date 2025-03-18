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
  createdAt: number; // guardamos getTime()
  replies?: Comment[];
}

interface DailyEvaluation {
  id: string;
  date: string; // 'YYYY-MM-DD'
  goodCount: number;
  regularCount: number;
  badCount: number;
  comments: Comment[];
}

export const useEvaluations = () => {
  const [dailyData, setDailyData] = useState<DailyEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  const todayId = moment().format('YYYY-MM-DD'); // Ex: '2025-03-16'

  // Carrega os dados do dia atual
  const loadTodayEvaluations = async () => {
    setLoading(true);
    const docRef = doc(db, 'evaluations', todayId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setDailyData({
        id: docSnap.id,
        date: data.date,
        goodCount: data.goodCount,
        regularCount: data.regularCount,
        badCount: data.badCount,
        comments: data.comments || [],
      });
    } else {
      // Se não existir doc para hoje, cria um novo
      await setDoc(docRef, {
        date: todayId,
        goodCount: 0,
        regularCount: 0,
        badCount: 0,
        comments: [],
        createdAt: Timestamp.now(),
      });
      setDailyData({
        id: todayId,
        date: todayId,
        goodCount: 0,
        regularCount: 0,
        badCount: 0,
        comments: [],
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTodayEvaluations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para registrar avaliação (Bom, Razoável, Ruim)
  const registerEvaluation = async (type: 'good' | 'regular' | 'bad') => {
    if (!dailyData) return;
    const docRef = doc(db, 'evaluations', dailyData.id);

    if (type === 'good') {
      await updateDoc(docRef, { goodCount: dailyData.goodCount + 1 });
      setDailyData((prev) => prev && { ...prev, goodCount: prev.goodCount + 1 });
    } else if (type === 'regular') {
      await updateDoc(docRef, { regularCount: dailyData.regularCount + 1 });
      setDailyData((prev) => prev && { ...prev, regularCount: prev.regularCount + 1 });
    } else {
      await updateDoc(docRef, { badCount: dailyData.badCount + 1 });
      setDailyData((prev) => prev && { ...prev, badCount: prev.badCount + 1 });
    }
  };

  // Adicionar comentário
  const addComment = async (userId: string, text: string) => {
    if (!dailyData) return;
    const docRef = doc(db, 'evaluations', dailyData.id);
    const newComment: Comment = {
      userId,
      text,
      createdAt: new Date().getTime(),
      replies: [],
    };
    await updateDoc(docRef, {
      comments: arrayUnion(newComment),
    });
    // Recarrega doc
    loadTodayEvaluations();
  };

  // Filtrar dados por dia, semana, mês, ano
  // Retorna um array de documentos (DailyEvaluation)
  const fetchEvaluationsByRange = async (start: string, end: string) => {
    // start e end no formato 'YYYY-MM-DD'
    const qRef = query(
      collection(db, 'evaluations'),
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date', 'asc')
    );
    const snapshot = await getDocs(qRef);

    const results: DailyEvaluation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        date: data.date,
        goodCount: data.goodCount,
        regularCount: data.regularCount,
        badCount: data.badCount,
        comments: data.comments || [],
      });
    });
    return results;
  };

  return {
    dailyData,
    loading,
    registerEvaluation,
    addComment,
    loadTodayEvaluations,
    fetchEvaluationsByRange,
  };
};
