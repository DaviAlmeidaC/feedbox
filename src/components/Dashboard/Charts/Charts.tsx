import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip } from 'chart.js';
import { useEvaluations } from '../../../hooks/useEvaluations';
import moment from 'moment';

ChartJS.register(ArcElement, BarElement, Tooltip);

const Charts: React.FC = () => {
  const { fetchEvaluationsByRange } = useEvaluations();
  const [dailyData, setDailyData] = useState<any>(null);  // Dados diários
  const [weeklyData, setWeeklyData] = useState<any>(null); // Dados semanais

  useEffect(() => {
    const loadDaily = async () => {
      const start = moment().startOf('day').format('YYYY-MM-DD');
      const end = moment().endOf('day').format('YYYY-MM-DD');
      const data = await fetchEvaluationsByRange(start, end);
      setDailyData(buildPieChartData(data)); // Dados para o gráfico de Pizza
    };

    const loadWeekly = async () => {
      const start = moment().startOf('week').format('YYYY-MM-DD');
      const end = moment().endOf('week').format('YYYY-MM-DD');
      const data = await fetchEvaluationsByRange(start, end);
      setWeeklyData(buildBarChartData(data)); // Dados para o gráfico de Colunas
    };

    loadDaily();
    loadWeekly();
  }, []);

  // ✅ Correção: Agora somamos os valores corretamente para o gráfico de pizza
  const buildPieChartData = (evals: any[]) => {
    const good = evals.reduce((sum, e) => sum + (e.goodCount || 0), 0);
    const regular = evals.reduce((sum, e) => sum + (e.regularCount || 0), 0);
    const bad = evals.reduce((sum, e) => sum + (e.badCount || 0), 0);

    return {
      labels: ['Bom', 'Razoável', 'Ruim'],
      datasets: [
        {
          data: [good, regular, bad],
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        },
      ],
    };
  };

  const buildBarChartData = (evals: any[]) => {
    const weekLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const good = new Array(7).fill(0);
    const regular = new Array(7).fill(0);
    const bad = new Array(7).fill(0);

    evals.forEach((e) => {
      const dayOfWeek = moment(e.date).day();
      good[dayOfWeek] += e.goodCount;
      regular[dayOfWeek] += e.regularCount;
      bad[dayOfWeek] += e.badCount;
    });

    return {
      labels: weekLabels,
      datasets: [
        {
          label: 'Bom',
          data: good,
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Razoável',
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
        {dailyData ? (
          <Pie
            data={dailyData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.dataset.label || '';
                      const value = tooltipItem.raw;
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Carregando dados diários...</p>
        )}
      </div>

      <div className="chart-box">
        <h3>Avaliações Semanais</h3>
        {weeklyData ? (
          <Bar
            data={weeklyData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.dataset.label || '';
                      const value = tooltipItem.raw;
                      return `${label}: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Carregando dados semanais...</p>
        )}
      </div>
    </div>
  );
};

export default Charts;
