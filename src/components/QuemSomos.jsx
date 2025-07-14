import React from 'react';
import './QuemSomos.css';
import fotoPerfil from '../assets/perfil-dalta.jpg';

function QuemSomos() {
  return (
    <section id="quem-somos" className="quem-somos-section">
      <div className="quem-somos-container">
        <div className="quem-somos-imagem">
          <img src={fotoPerfil} alt="Eduardo Dalta, o barbeiro" />
        </div>
        <div className="quem-somos-texto">
          <h2>Uma Tradição de Qualidade em Sepetiba</h2>
          <p>
            Bem-vindo à <strong>Barbearia do Dalta</strong>, o seu novo ponto de referência para estilo e cuidado masculino em Sepetiba. 
            Aqui, a tradição da barbearia artesanal encontra as técnicas mais modernas para oferecer um resultado impecável.
          </p>
          <p>
            Sob o comando de <strong>Eduardo Dalta</strong>, profissional com <strong>mais de 5 anos de experiência</strong> e formado pelas renomadas escolas do <strong>Instituto Embelleze</strong>, 
            nossa missão é oferecer mais do que um simples corte. Oferecemos uma experiência completa, com atendimento personalizado, atenção aos detalhes e um ambiente feito para você relaxar.
          </p>
          <p>
            Seja para um corte clássico, um fade na régua ou um tratamento de barba, você está em boas mãos.
          </p>
        </div>
      </div>
    </section>
  );
}

export default QuemSomos;