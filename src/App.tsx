import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/Auth/PrivateRoute';
import Charts from './components/Dashboard/Charts/Charts'; // Importando os gráficos diários e semanais
import ChartsMensalAnual from './components/Dashboard/Charts/ChartsMensalAnual'; // Importando os gráficos mensais e anuais

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial (pública) */}
        <Route path="/" element={<Home />} />

        {/* Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

        {/* Dashboard (privado) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Gráficos Diário e Semanal */}
        <Route
          path="/diario-semanal"
          element={
            <PrivateRoute>
              <Charts />
            </PrivateRoute>
          }
        />

        {/* Gráficos Mensal e Anual */}
        <Route
          path="/mensal-anual"
          element={
            <PrivateRoute>
              <ChartsMensalAnual />
            </PrivateRoute>
          }
        />

        {/* Rota fallback */}
        <Route path="*" element={<h2>404 - Página não encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
