// src/pages/ResetPassword.tsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Link } from 'react-router-dom';
import '../styles/AuthLayout.css';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem('E-mail de recuperação de senha enviado!');
    } catch (error) {
      setMensagem('Erro ao enviar e-mail de recuperação.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="contact-links">
          <Link to="/contact">Contato</Link>
          <Link to="/login">Entrar</Link>
        </div>
        <div className="logo">FeedBox</div>
        <h2 className="auth-title">Recuperar Senha</h2>
        <form className="auth-form" onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
        {mensagem && <p style={{ marginTop: '10px' }}>{mensagem}</p>}
      </div>
      <div className="auth-right" />
    </div>
  );
};

export default ResetPassword;
