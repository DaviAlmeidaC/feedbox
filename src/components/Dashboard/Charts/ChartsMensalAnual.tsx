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
    const loadMonthly = async () => {
      const start = moment().startOf('month').format('YYYY-MM-DD');
      const end = moment().endOf('month').format('YYYY-MM-DD');
      const data = await fetchEvaluationsByRange(start, end);
      setMonthlyData(buildChartData(data, 'Mês atual'));
    };

    const loadAnnual = async () => {
      const start = moment().startOf('year').format('YYYY-MM-DD');
      const end = moment().endOf('year').format('YYYY-MM-DD');
      const data = await fetchEvaluationsByRange(start, end);
      setAnnualData(buildChartData(data, 'Ano atual'));
    };

    loadMonthly();
    loadAnnual();
  }, []);

  const buildChartData = (evals: any[], label: string) => {
    const labels = evals.map((e) => e.date);
    const good = evals.map((e) => e.goodCount);
    const regular = evals.map((e) => e.regularCount);
    const bad = evals.map((e) => e.badCount);

    return {
      labels,
      datasets: [
        { label: `Bom - ${label}`, data: good, borderColor: 'green', fill: false },
        { label: `Razoável - ${label}`, data: regular, borderColor: 'orange', fill: false },
        { label: `Ruim - ${label}`, data: bad, borderColor: 'red', fill: false },
      ],
    };
  };

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Registro Mensal</h3>
        {monthlyData ? (
          <Line
            data={monthlyData}
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
          <p>Carregando dados mensais...</p>
        )}
      </div>

      <div className="chart-box">
        <h3>Registro Anual</h3>
        {annualData ? (
          <Line
            data={annualData}
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
          <p>Carregando dados anuais...</p>
        )}
      </div>
    </div>
  );
};

export default ChartsMensalAnual;
