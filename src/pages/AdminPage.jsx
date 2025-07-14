import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Função para obter a data de hoje no formato AAAA-MM-DD
const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

export default function AdminPage() {
    // 1. Pega o token do nosso contexto de autenticação.
    // É crucial para as chamadas da API.
    const { token } = useAuth();

    // Estados da página
    const [dataSelecionada, setDataSelecionada] = useState(getTodayDateString());
    const [diasDisponiveis, setDiasDisponiveis] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [faturamento, setFaturamento] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Efeito para gerar a lista de dias para o seletor (pulando domingos e segundas)
    useEffect(() => {
        const getProximosDiasUteis = () => {
            const dias = [];
            let diaAtual = new Date();
            while (dias.length < 15) {
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

    // Efeito para buscar os dados da API sempre que a data ou o token mudarem
    useEffect(() => {
        // Só tenta buscar se uma data foi selecionada E se temos um token
        if (dataSelecionada && token) {
            setLoading(true);
            setError('');

            // 2. Prepara o cabeçalho de autorização que será usado em ambas as requisições
            const headers = { 'Authorization': `Bearer ${token}` };

            const fetchAgendamentos = fetch(`http://localhost:8080/api/agendamentos?data=${dataSelecionada}`, { headers });
            const fetchFaturamento = fetch(`http://localhost:8080/api/agendamentos/faturamento?data=${dataSelecionada}`, { headers });

            Promise.all([fetchAgendamentos, fetchFaturamento])
                .then(async ([resAgendamentos, resFaturamento]) => {
                    if (resAgendamentos.status === 403 || resFaturamento.status === 403) {
                        setError('Acesso negado. Apenas administradores podem ver estes dados.');
                        setAgendamentos([]);
                        setFaturamento(0);
                        return;
                    }
                    if (!resAgendamentos.ok || !resFaturamento.ok) {
                        throw new Error('Falha ao buscar dados do servidor.');
                    }
                    
                    const dadosAgendamentos = await resAgendamentos.json();
                    const dadosFaturamento = await resFaturamento.json();
                    
                    setAgendamentos(dadosAgendamentos);
                    setFaturamento(dadosFaturamento);
                })
                .catch(err => {
                    console.error("Erro ao buscar dados do admin:", err);
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [dataSelecionada, token]); // Roda sempre que a data ou o token forem alterados


    return (
        <div className="admin-page-container">
            <Navbar />
            <main className="admin-content">
                <h1>Painel do Administrador</h1>
                <p>Selecione uma data para ver os agendamentos e o faturamento do dia.</p>
                
                <div className="admin-controls">
                    <label htmlFor="data-admin">Selecione o dia</label>
                    <select 
                        id="data-admin"
                        value={dataSelecionada} 
                        onChange={(e) => setDataSelecionada(e.target.value)}
                    >
                        {diasDisponiveis.map(dia => {
                            const diaFormatadoAPI = dia.toISOString().split('T')[0];
                            const diaParaExibir = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }).format(dia);
                            return (
                                <option key={diaFormatadoAPI} value={diaFormatadoAPI}>
                                    {diaFormatadoAPI === getTodayDateString() ? `Hoje (${diaParaExibir})` : diaParaExibir}
                                </option>
                            );
                        })}
                    </select>
                </div>
                
                {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}

                <div className="admin-summary">
                    <div className="summary-card">
                        <h3>Agendamentos no Dia</h3>
                        <span className="summary-value">{loading ? '...' : agendamentos.length}</span>
                    </div>
                    <div className="summary-card">
                        <h3>Faturamento do Dia</h3>
                        <span className="summary-value">{loading ? '...' : `R$ ${Number(faturamento).toFixed(2).replace('.', ',')}`}</span>
                    </div>
                </div>

                <div className="appointments-table-container">
                    <h2>Agendamentos para {new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(dataSelecionada))}</h2>
                    {loading ? <p>Carregando...</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Horário</th>
                                    <th>Cliente</th>
                                    <th>Telefone</th>
                                    <th>Serviço</th>
                                    <th>Preço</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agendamentos.length > 0 ? (
                                    agendamentos.sort((a, b) => a.hora.localeCompare(b.hora)).map(ag => (
                                        <tr key={ag.id}>
                                            <td>{ag.hora}</td>
                                            <td>{ag.nome}</td>
                                            <td>{ag.telefone}</td>
                                            <td>{ag.servico.nome}</td>
                                            <td>R$ {Number(ag.servico.preco).toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center'}}>Nenhum agendamento para esta data.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}