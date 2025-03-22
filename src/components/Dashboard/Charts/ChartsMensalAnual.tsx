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
      // Dados Mensais (Últimos 12 meses)
      const startMonth = moment().subtract(11, 'months').startOf('month').format('YYYY-MM-DD');
      const endMonth = moment().endOf('month').format('YYYY-MM-DD');
      const monthData = await fetchEvaluationsByRange(startMonth, endMonth);
      setMonthlyData(buildChartData(monthData, 'mensal'));

      // Dados Anuais (Últimos 5 anos)
      const startYear = moment().subtract(4, 'years').startOf('year').format('YYYY-MM-DD');
      const endYear = moment().endOf('year').format('YYYY-MM-DD');
      const yearData = await fetchEvaluationsByRange(startYear, endYear);
      setAnnualData(buildChartData(yearData, 'anual'));
    };

    loadChartData();
  }, []);

  const buildChartData = (evals: any[], type: 'mensal' | 'anual') => {
    const groupedData: Record<string, { good: number; regular: number; bad: number }> = {};

    evals.forEach((e) => {
      const key = type === 'mensal' ? moment(e.date).format('MMMM') : moment(e.date).format('YYYY');

      if (!groupedData[key]) {
        groupedData[key] = { good: 0, regular: 0, bad: 0 };
      }

      groupedData[key].good += e.goodCount || 0;
      groupedData[key].regular += e.regularCount || 0;
      groupedData[key].bad += e.badCount || 0;
    });

    const labels = Object.keys(groupedData);
    const good = labels.map((key) => groupedData[key].good);
    const regular = labels.map((key) => groupedData[key].regular);
    const bad = labels.map((key) => groupedData[key].bad);

    return {
      labels,
      datasets: [
        { label: 'Bom', data: good, borderColor: 'green', fill: false },
        { label: 'Regular', data: regular, borderColor: 'orange', fill: false },
        { label: 'Ruim', data: bad, borderColor: 'red', fill: false },
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
