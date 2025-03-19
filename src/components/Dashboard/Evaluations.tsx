// src/components/Dashboard/Evaluations.tsx
import React from 'react';
import { useEvaluations } from '../../hooks/useEvaluations';

const Evaluations: React.FC = () => {
  const { dailyData, registerEvaluation } = useEvaluations();

  if (!dailyData) return null;

  return (
    <div style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '8px' }}>
      <h3>Avaliações do Dia: {dailyData.date}</h3>
      <p>
        <strong>Bom:</strong> {dailyData.goodCount} |{' '}
        <strong>Regular:</strong> {dailyData.regularCount} |{' '}
        <strong>Ruim:</strong> {dailyData.badCount}
      </p>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => registerEvaluation('good')} style={{ marginRight: '10px' }}>
          Bom
        </button>
        <button onClick={() => registerEvaluation('regular')} style={{ marginRight: '10px' }}>
          Razoável
        </button>
        <button onClick={() => registerEvaluation('bad')}>Ruim</button>
      </div>
    </div>
  );
};

export default Evaluations;
