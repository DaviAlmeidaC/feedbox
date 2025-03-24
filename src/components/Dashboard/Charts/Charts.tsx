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
      try {
        // Carregar dados diários
        const today = moment().format('YYYY-MM-DD');
        console.log(`Buscando avaliações para ${today}...`);
        const dayData = await fetchEvaluationsByRange(today, today);
        console.log('Dados diários recebidos:', dayData);
        setDailyData(buildPieChartData(dayData));

        // Carregar dados semanais (últimos 7 dias)
        const startWeek = moment().subtract(6, 'days').format('YYYY-MM-DD');
        const endWeek = moment().format('YYYY-MM-DD');
        console.log(`Buscando avaliações semanais de ${startWeek} a ${endWeek}...`);
        const weekData = await fetchEvaluationsByRange(startWeek, endWeek);
        console.log('Dados semanais recebidos:', weekData);
        setWeeklyData(buildBarChartData(weekData));
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };

    loadChartData();
  }, []);

  const buildPieChartData = (evals: any[]) => {
    if (!evals || evals.length === 0) {
      console.warn('Nenhum dado diário encontrado.');
      return null;
    }

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
    if (!evals || evals.length === 0) {
      console.warn('Nenhum dado semanal encontrado.');
      return null;
    }

    // Agrupar os dados corretamente por dia da semana
    const groupedData: Record<string, { good: number; regular: number; bad: number }> = {};

    evals.forEach((e) => {
      const day = moment(e.date).format('ddd'); // Ex: "Seg", "Ter"
      if (!groupedData[day]) {
        groupedData[day] = { good: 0, regular: 0, bad: 0 };
      }
      groupedData[day].good += e.goodCount || 0;
      groupedData[day].regular += e.regularCount || 0;
      groupedData[day].bad += e.badCount || 0;
    });

    const labels = Object.keys(groupedData);
    const good = labels.map((key) => groupedData[key].good);
    const regular = labels.map((key) => groupedData[key].regular);
    const bad = labels.map((key) => groupedData[key].bad);

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

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Avaliações Diárias</h3>
        {dailyData ? <Pie data={dailyData} options={{ responsive: true }} /> : <p>Carregando dados diários...</p>}
      </div>

      <div className="chart-box">
        <h3>Avaliações Semanais</h3>
        {weeklyData ? <Bar data={weeklyData} options={{ responsive: true }} /> : <p>Carregando dados semanais...</p>}
      </div>
    </div>
  );
};

export default Charts;
