import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';
import './Auth.css';

export default function RegisterPage() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        const userData = { nome, telefone, login, password };
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const successMessage = await response.text();
                toast.success(successMessage);
                navigate('/login');
            } else {
                
                const mensagemDeErro = await response.text();
               
                toast.error(mensagemDeErro || 'Falha no cadastro. Tente novamente.');
            }
        } catch (error) {
            toast.error('Erro de rede. O servidor parece estar offline.');
            console.error('Erro ao cadastrar:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Crie sua Conta</h2>
                <p>Preencha os campos para começar a agendar.</p>
                <form className="auth-form" onSubmit={handleRegister}>
                    <label htmlFor="nome">Nome Completo</label>
                    <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required />

                    <label htmlFor="telefone">Telefone (WhatsApp)</label>
                    <IMaskInput id="telefone" mask="(00) 00000-0000" value={telefone} onAccept={(value) => setTelefone(value)} required />

                    <label htmlFor="login">Login (Apelido ou E-mail)</label>
                    <input id="login" type="text" value={login} onChange={e => setLogin(e.target.value)} required />

                    <label htmlFor="password">Senha</label>
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

                    <button type="submit" className="auth-button">Cadastrar</button>
                </form>
                <div className="auth-switch-link">
                  Já tem uma conta? <Link to="/login">Faça o login</Link>
                </div>
            </div>
        </div>
    );
}