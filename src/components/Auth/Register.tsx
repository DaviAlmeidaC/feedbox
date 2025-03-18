// src/components/Auth/Register.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import  imgright from '../../assets/logo.png' 
import '../../styles/AuthLayout.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Erro ao criar conta. Verifique se o e-mail já está em uso.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="contact-links">
          
          <Link to="/login">Entrar</Link>
        </div>
        <div className="logo"><img src={imgright} alt="" /></div>
        <h2 className="auth-title">Cadastrar</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Cadastrar</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        
      </div>
      <div className="auth-right" />
    </div>
  );
};

export default Register;
