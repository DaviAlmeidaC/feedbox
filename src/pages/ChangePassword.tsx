// src/pages/ChangePassword.tsx
import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthLayout.css';
import { Link } from 'react-router-dom';

const ChangePassword: React.FC = () => {
  const { currentUser } = useAuth();
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await updatePassword(currentUser, novaSenha);
      setMensagem('Senha atualizada com sucesso!');
    } catch (error) {
      setMensagem('Erro ao atualizar senha.');
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
        <h2 className="auth-title">Alterar Senha</h2>
        <form className="auth-form" onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <button type="submit">Alterar</button>
        </form>
        {mensagem && <p style={{ marginTop: '10px' }}>{mensagem}</p>}
      </div>
      <div className="auth-right" />
    </div>
  );
};

export default ChangePassword;
