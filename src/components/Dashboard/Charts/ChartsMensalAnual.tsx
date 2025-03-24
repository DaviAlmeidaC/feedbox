import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { useEvaluations } from '../../../hooks/useEvaluations';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const ChartsMensalAnual: React.FC = () => {
  const { fetchEvaluationsByRange } = useEvaluations();
  const [dailyData, setDailyData] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [yearlyData, setYearlyData] = useState<any>(null);

  useEffect(() => {
    const loadChartData = async () => {
      // Dados Diários (Últimos 15 dias)
      const startDaily = moment().subtract(14, 'days').format('YYYY-MM-DD');
      const endDaily = moment().format('YYYY-MM-DD');
      const dailyEvaluations = await fetchEvaluationsByRange(startDaily, endDaily);
      setDailyData(buildChartData(dailyEvaluations, 'diario'));

      // Dados Mensais (Últimos 12 meses)
      const startMonthly = moment().subtract(11, 'months').startOf('month').format('YYYY-MM-DD');
      const endMonthly = moment().endOf('month').format('YYYY-MM-DD');
      const monthlyEvaluations = await fetchEvaluationsByRange(startMonthly, endMonthly);
      setMonthlyData(buildChartData(monthlyEvaluations, 'mensal'));

      // Dados Anuais (Últimos 5 anos)
      const startYearly = moment().subtract(4, 'years').startOf('year').format('YYYY-MM-DD');
      const endYearly = moment().endOf('year').format('YYYY-MM-DD');
      const yearlyEvaluations = await fetchEvaluationsByRange(startYearly, endYearly);
      setYearlyData(buildChartData(yearlyEvaluations, 'anual'));
    };

    loadChartData();
  }, []);

  const buildChartData = (evaluations: any[], type: 'diario' | 'mensal' | 'anual') => {
    const groupedData: Record<string, { good: number; regular: number; bad: number }> = {};

    evaluations.forEach((e) => {
      const key = type === 'diario'
        ? moment(e.date).format('DD/MM')
        : type === 'mensal'
        ? moment(e.date).format('MMMM') // Apenas o nome do mês
        : moment(e.date).format('YYYY'); // Apenas o ano

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
        {yearlyData ? <Line data={yearlyData} options={{ responsive: true }} /> : <p>Carregando dados anuais...</p>}
      </div>
    </div>
  );
};

export default ChartsMensalAnual;
