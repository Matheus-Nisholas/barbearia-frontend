import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import QuemSomos from '../components/QuemSomos';
import Footer from '../components/Footer';
import '../App.css';

export default function AgendamentoPage() {
  const { token, user } = useAuth(); 

  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [data, setData] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);
  const [servicosApi, setServicosApi] = useState([]);

  // Função reutilizável para buscar horários ocupados
  const fetchOcupados = useCallback((dataSelecionada) => {
    if (dataSelecionada) {
      fetch(`http://localhost:8080/api/agendamentos/ocupados?data=${dataSelecionada}`)
        .then(response => response.json())
        .then(data => setHorariosOcupados(data))
        .catch(error => console.error("Erro ao buscar horários ocupados:", error));
    } else {
      setHorariosOcupados([]);
    }
  }, []);

  // Efeitos para buscar dados iniciais da API e gerar os dias
  useEffect(() => {
    fetch('http://localhost:8080/api/agendamentos/horarios-disponiveis')
      .then(response => response.json())
      .then(data => setHorarios(data));
    
    fetch('http://localhost:8080/api/servicos')
      .then(response => response.json())
      .then(data => setServicosApi(data))
      .catch(error => console.error("Erro ao buscar serviços:", error));

    const getProximosDiasUteis = () => {
      const dias = [];
      let diaAtual = new Date();
      while (dias.length < 7) {
        const diaDaSemana = diaAtual.getDay();
        if (diaDaSemana !== 0 && diaDaSemana !== 1) {
          dias.push(new Date(diaAtual.getTime()));
        }
        diaAtual.setDate(diaAtual.getDate() + 1);
      }
      setDiasDisponiveis(dias);
    };
    getProximosDiasUteis();
  }, []);

  // Efeito que busca os horários ocupados sempre que uma nova data é selecionada
  useEffect(() => {
    setHorarioSelecionado(null);
    fetchOcupados(data);
  }, [data, fetchOcupados]);

  // Função para lidar com o envio do formulário de agendamento
  const handleAgendar = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para fazer um agendamento.");
      return;
    }
    if (!horarioSelecionado || !data || !servicoSelecionado) {
      toast.warn('Por favor, preencha todos os campos!');
      return;
    }
    const agendamentoParaEnviar = { data, hora: horarioSelecionado, servico: servicoSelecionado };
    try {
      const response = await fetch('http://localhost:8080/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(agendamentoParaEnviar),
      });
      if (response.ok) {
        toast.success('Agendamento realizado com sucesso!');
        // A CORREÇÃO PRINCIPAL: Re-busca a lista de ocupados do backend
        fetchOcupados(data);
        setHorarioSelecionado(null);
      } else {
        const mensagemDeErro = await response.text();
        toast.error(mensagemDeErro);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      toast.error('Ocorreu um erro de rede.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="agendamento-container">
        <header className="agendamento-header">
          <h1>Barbearia do Dalta</h1>
          <p>O corte que define seu estilo. A barba que impõe respeito.</p>
          <a href="#agendamento" className="cta-button">Agendar Meu Horário</a>
        </header>

        <QuemSomos />

        <section id="agendamento" style={{ paddingTop: '70px' }}>
          <main className="agendamento-main">
            <div className="horarios-disponiveis">
              <h2>1. Escolha data, serviço e horário</h2>
              
              <label htmlFor="data">Escolha o Dia</label>
              <select id="data" value={data} onChange={e => setData(e.target.value)} required>
                <option value="" disabled>-- Selecione um dia --</option>
                {diasDisponiveis.map(dia => {
                  const diaFormatadoAPI = dia.toISOString().split('T')[0];
                  const diaParaExibir = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }).format(dia);
                  return (
                    <option key={diaFormatadoAPI} value={diaFormatadoAPI}>
                      {new Date().toDateString() === dia.toDateString() ? `Hoje (${diaParaExibir})` : diaParaExibir}
                    </option>
                  );
                })}
              </select>

              <label htmlFor="servico">Escolha o Serviço</label>
              <select id="servico" value={servicoSelecionado} onChange={e => setServicoSelecionado(e.target.value)} required>
                <option value="" disabled>-- Selecione um serviço --</option>
                {servicosApi.map(servico => (
                  <option key={servico.id} value={servico.nome}>
                    {servico.nome} (R$ {Number(servico.preco).toFixed(2).replace('.',',')})
                  </option>
                ))}
              </select>

              <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Horários disponíveis para o dia selecionado:</p>
              <div className="lista-horarios">
                {horarios.map(horario => {
                  const isOcupado = horariosOcupados.includes(horario);
                  return (
                    <button 
                      key={horario} 
                      onClick={() => !isOcupado && setHorarioSelecionado(horario)}
                      disabled={!data || !servicoSelecionado || isOcupado}
                      className={`${isOcupado ? 'ocupado' : ''} ${horario === horarioSelecionado ? 'selecionado' : ''}`}
                    >
                      {horario}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-agendamento">
              <h2>2. Confirme seu Agendamento</h2>
              <form onSubmit={handleAgendar}>
                <div className='resumo-agendamento' style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '6px', border: '1px solid var(--cor-borda)' }}>
                  {user ? (
                    <>
                      <p><strong>Cliente:</strong> {user.nome}</p>
                      <p><strong>Telefone:</strong> {user.telefone}</p>
                    </>
                  ) : (
                    <p><strong>Faça o login para agendar!</strong></p>
                  )}
                  <hr/>
                  <p><strong>Data:</strong> {data ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(data)) : 'Nenhuma'}</p>
                  <p><strong>Serviço:</strong> {servicoSelecionado || 'Nenhum'}</p>
                  <p><strong>Horário:</strong> {horarioSelecionado || 'Nenhum'}</p>
                </div>
                
                <button type="submit" className="botao-confirmar" disabled={!user || !horarioSelecionado || !data || !servicoSelecionado}>
                  Confirmar Agendamento
                </button>
              </form>
            </div>
          </main>
        </section>
      </div>
      <Footer />
    </div>
  );
}