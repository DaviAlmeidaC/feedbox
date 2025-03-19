// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import  imgright from '../../assets/logo.png' 
import '../../styles/AuthLayout.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="contact-links">
        
         <Link className='negrito' to="/register">Registrar</Link>
        </div>
        <div className="logo"><img src={imgright} alt="" /></div>
        <h2 className="auth-title">Entrar</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input className='botão'
            type="email"
            placeholder="Nome ou E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input className='botão'
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <p>
            <Link to="/reset-password" className='esqueceusenha'> Esqueceu a senha?</Link>
          </p>
          <button type="submit">Entrar</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className="auth-links">
          
         
        </div>
      </div>
      <div className="auth-right"  />
    </div>
  );
};

export default Login;
