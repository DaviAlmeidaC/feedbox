// src/components/Dashboard/FilterBar.tsx
import React, { useState } from 'react';
import moment from 'moment';
import { useEvaluations } from '../../hooks/useEvaluations';

const FilterBar: React.FC = () => {
  const { fetchEvaluationsByRange } = useEvaluations();
  const [results, setResults] = useState<any[]>([]);

  const handleFilter = async (type: 'day' | 'week' | 'month' | 'year') => {
    let start = '';
    let end = '';

    switch (type) {
      case 'day':
        start = moment().format('YYYY-MM-DD');
        end = start;
        break;
      case 'week':
        start = moment().startOf('week').format('YYYY-MM-DD');
        end = moment().endOf('week').format('YYYY-MM-DD');
        break;
      case 'month':
        start = moment().startOf('month').format('YYYY-MM-DD');
        end = moment().endOf('month').format('YYYY-MM-DD');
        break;
      case 'year':
        start = moment().startOf('year').format('YYYY-MM-DD');
        end = moment().endOf('year').format('YYYY-MM-DD');
        break;
    }

    const data = await fetchEvaluationsByRange(start, end);
    setResults(data);
  };

  return (
    <div style={{ marginBottom: '20px', background: '#fff', padding: '10px', borderRadius: '8px' }}>
      <button onClick={() => handleFilter('day')} style={{ marginRight: '10px' }}>
        Dia
      </button>
      <button onClick={() => handleFilter('week')} style={{ marginRight: '10px' }}>
        Semana
      </button>
      <button onClick={() => handleFilter('month')} style={{ marginRight: '10px' }}>
        Mês
      </button>
      <button onClick={() => handleFilter('year')}>Ano</button>

      {results.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <h4>Resultados do Filtro:</h4>
          {results.map((r) => (
            <p key={r.id}>
              {r.date} - Bom: {r.goodCount}, Razoável: {r.regularCount}, Ruim: {r.badCount}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
