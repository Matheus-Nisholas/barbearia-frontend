import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer id="contato" className="footer-section">
      <div className="footer-container">
        <h2>Endereço e Contato</h2>
        <div className="contato-info">
          <p>Estamos esperando por você! Venha nos fazer uma visita ou mande uma mensagem.</p>
          <ul>
            <li><strong>Endereço:</strong> Ilha do Tatu, 3º arvore - Sepetiba, Rio de Janeiro - RJ</li>
            <li><strong>WhatsApp:</strong> (21) 96532-1202</li>
            <li><strong>Funcionamento:</strong> Terça a Sábado, das 09:00 às 20:00</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Barbearia do Dalta - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;