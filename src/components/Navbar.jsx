import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from './ProfileModal';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <Link to="/#quem-somos" className="nav-item">Quem Somos</Link>
            <Link to="/#agendamento" className="nav-item">Agendar</Link>
            <Link to="/#contato" className="nav-item">Contato</Link>
          </div>

          <div className="nav-right">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/controle" className="nav-item">Painel Admin</Link>
                )}
                
                <button onClick={() => setIsModalOpen(true)} className="nav-button-link">
                  Olá, {user.nome}!
                </button>

                <button onClick={handleLogout} className="nav-button">Sair</button>
              </>
            ) : (
              <Link to="/login" className="nav-button">Login / Cadastro</Link>
            )}
          </div>
        </div>
      </nav>
      
      <ProfileModal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
}

export default Navbar;