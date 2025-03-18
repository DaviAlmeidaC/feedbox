// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthLayout.css'; // Podemos reaproveitar layout
import  imgright from '../../src/assets/logo.png' 

const Home: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="contact-links">
          
        </div>
        <div className="logo"><img src={imgright} alt="" /></div>
        <h1 className='h1se'>Bem-vindo ao FeedBox!</h1>
        <p>Aqui você poderá avaliar produtos e ver relatórios no painel admin.</p>
        <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ marginRight: '20px' }}>
  <button className="button-custom">Entrar</button>
</Link>

<Link to="/register">
  <button className="button-custom">Cadastrar</button>
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
