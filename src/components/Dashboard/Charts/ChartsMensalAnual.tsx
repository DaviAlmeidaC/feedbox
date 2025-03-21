// src/components/ChartsMensalAnual.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { useEvaluations } from '../../../hooks/useEvaluations';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const ChartsMensalAnual: React.FC = () => {
  const { fetchEvaluationsByRange } = useEvaluations();
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [annualData, setAnnualData] = useState<any>(null);

  useEffect(() => {
    const loadChartData = async () => {
      const startMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endMonth = moment().endOf('month').format('YYYY-MM-DD');
      const monthData = await fetchEvaluationsByRange(startMonth, endMonth);
      setMonthlyData(buildChartData(monthData, 'Mês atual'));

      const startYear = moment().startOf('year').format('YYYY-MM-DD');
      const endYear = moment().endOf('year').format('YYYY-MM-DD');
      const yearData = await fetchEvaluationsByRange(startYear, endYear);
      setAnnualData(buildChartData(yearData, 'Ano atual'));
    };
    loadChartData();
  }, []);

  const buildChartData = (evals: any[], label: string) => {
    const labels = evals.map((e) => (label === 'Mês atual' ? moment(e.date).format('DD') : moment(e.date).format('MM/YYYY')));
    const good = evals.map((e) => e.goodCount);
    const regular = evals.map((e) => e.regularCount);
    const bad = evals.map((e) => e.badCount);

    return {
      labels,
      datasets: [
        { label: `Bom - ${label}`, data: good, borderColor: 'green', fill: false },
        { label: `Regular - ${label}`, data: regular, borderColor: 'orange', fill: false },
        { label: `Ruim - ${label}`, data: bad, borderColor: 'red', fill: false },
      ],
    };
  };

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Registro Mensal</h3>
        {monthlyData ? <Line data={monthlyData} options={{ responsive: true }} /> : <p>Carregando dados mensais...</p>}
      </div>
      <div className="chart-box">
        <h3>Registro Anual</h3>
        {annualData ? <Line data={annualData} options={{ responsive: true }} /> : <p>Carregando dados anuais...</p>}
      </div>
    </div>
  );
};

export default ChartsMensalAnual;