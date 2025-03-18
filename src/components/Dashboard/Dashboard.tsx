import React, { useState } from 'react';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import Evaluations from './Evaluations';
import Comments from './Coments';
import Charts from './Charts/Charts';
import ChartsMensalAnual from './Charts/ChartsMensalAnual';
import FilterBar from './FilterBar';
import imgright from '../../assets/logo.png';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState<'diario-semanal' | 'mensal-anual'>('diario-semanal');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className='fotodivido'><img src={imgright} alt="" /></div>
        <div className='dividir'>
          <div>
            <h2> Avaliações</h2>
          </div>
          <div>
            <span style={{ marginRight: '20px' }}>{currentUser?.email}</span>
            <button
              onClick={logout}
              className="btn-logout"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        

        {/* Avaliações */}
        <Evaluations />

        {/* Gráficos */}
        <div className="charts-container">
          {selectedTab === 'diario-semanal' && <Charts />}
          {selectedTab === 'mensal-anual' && <ChartsMensalAnual />}
        </div>

        {/* Comentários */}
        <div className="comments-container">
          <Comments />
        </div>

        {/* Filtro de data */}
        <FilterBar />
      </main>

      {/* Barra de Navegação Fixa */}
      <div className="fixed-nav">
        <button
          className={`nav-button ${selectedTab === 'diario-semanal' ? 'selected' : ''}`}
          onClick={() => setSelectedTab('diario-semanal')}
        >
          Registro Diário e Semanal
        </button>
        <button
          className={`nav-button ${selectedTab === 'mensal-anual' ? 'selected' : ''}`}
          onClick={() => setSelectedTab('mensal-anual')}
        >
          Registro Mensal e Anual
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
