import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, CategoryScale, LinearScale } from 'chart.js';
import { useEvaluations } from '../../../hooks/useEvaluations';
import moment from 'moment';

ChartJS.register(ArcElement, BarElement, Tooltip, CategoryScale, LinearScale);

const Charts: React.FC = () => {
  const { fetchEvaluationsByRange } = useEvaluations();
  const [dailyData, setDailyData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);

  useEffect(() => {
    const loadChartData = async () => {
      const startDay = moment().startOf('day').format('YYYY-MM-DD');
      const endDay = moment().endOf('day').format('YYYY-MM-DD');
      const dayData = await fetchEvaluationsByRange(startDay, endDay);
      setDailyData(buildPieChartData(dayData));

      const startWeek = moment().startOf('week').format('YYYY-MM-DD');
      const endWeek = moment().endOf('week').format('YYYY-MM-DD');
      const weekData = await fetchEvaluationsByRange(startWeek, endWeek);
      setWeeklyData(buildBarChartData(weekData));
    };

    loadChartData();
  }, []);

  const buildPieChartData = (evals: any[]) => {
    if (!evals || evals.length === 0) return null;

    const good = evals.reduce((sum, e) => sum + (e.goodCount || 0), 0);
    const regular = evals.reduce((sum, e) => sum + (e.regularCount || 0), 0);
    const bad = evals.reduce((sum, e) => sum + (e.badCount || 0), 0);

    return {
      labels: ['Boa', 'Razoável', 'Ruim'],
      datasets: [
        {
          label: 'Avaliações Diárias',
          data: [good, regular, bad],
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        },
      ],
    };
  };

  const buildBarChartData = (evals: any[]) => {
    if (!evals || evals.length === 0) return null;

    const labels = evals.map((e) => moment(e.date).format('ddd'));
    const good = evals.map((e) => e.goodCount || 0);
    const regular = evals.map((e) => e.regularCount || 0);
    const bad = evals.map((e) => e.badCount || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Bom',
          data: good,
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Regular',
          data: regular,
          backgroundColor: '#FFCE56',
        },
        {
          label: 'Ruim',
          data: bad,
          backgroundColor: '#FF6384',
        },
      ],
    };
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const labelIndex = tooltipItem.dataIndex;
            const labels = ['Boa', 'Razoável', 'Ruim'];
            const values = tooltipItem.dataset.data;
            return `${labels[labelIndex]}: ${values[labelIndex]}`;
          },
        },
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Avaliações Diárias</h3>
        {dailyData ? <Pie data={dailyData} options={pieChartOptions} /> : <p>Carregando dados diários...</p>}
      </div>

      <div className="chart-box">
        <h3>Avaliações Semanais</h3>
        {weeklyData ? <Bar data={weeklyData} options={{ responsive: true }} /> : <p>Carregando dados semanais...</p>}
      </div>
    </div>
  );
};

export default Charts;
