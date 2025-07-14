import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await auth.login(login, password);
      toast.success(`Bem-vindo de volta!`);
      navigate('/');
    } catch (err) {
      toast.error("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p>Acesse sua conta para continuar.</p>
        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="login">Login ou E-mail</label>
          <input id="login" type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
          
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit" className="auth-button">Entrar</button>
        </form>
        <div className="auth-switch-link">
          É novo por aqui? <Link to="/register">Crie sua conta</Link>
        </div>
      </div>
    </div>
  );
}