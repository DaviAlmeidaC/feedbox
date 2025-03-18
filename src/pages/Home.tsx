// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthLayout.css'; // Podemos reaproveitar layout

const Home: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="contact-links">
          <Link to="/contact">Contato</Link>
          <Link to="/login">Entrar</Link>
        </div>
        <div className="logo">FeedBox</div>
        <h1>Bem-vindo ao FeedBox!</h1>
        <p>Aqui você poderá avaliar produtos e ver relatórios no painel admin.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/login" style={{ marginRight: '20px' }}>
            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Entrar</button>
          </Link>
          <Link to="/register">
            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Cadastrar</button>
          </Link>
        </div>
      </div>
      <div className="auth-right">
        {/* Imagem ou cor de fundo */}
      </div>
    </div>
  );
};

export default Home;
