import React from 'react';
import Modal from 'react-modal';
import './ProfileModal.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '2rem'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

export default function ProfileModal({ isOpen, onRequestClose, user }) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Modal de Perfil"
    >
      <div className="profile-modal-header">
        <h2>Seu Perfil</h2>
        <button onClick={onRequestClose} className="close-button">&times;</button>
      </div>
      <div className="profile-modal-body">
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Telefone:</strong> {user.telefone || 'Não informado'}</p>
        <p><strong>Login:</strong> {user.sub}</p>
        <p><strong>Tipo de Conta:</strong> {user.role}</p>
      </div>
    </Modal>
  );
}