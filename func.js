const VALOR_PEDAGIO = 20.00;
const DISTANCIA = 120; 
const TAXA_ATE_60 = 0.15; 
const TAXA_ATE_100 = 0.10;
const TAXA_ACIMA_100 = 0; 

let veiculos = [];
let inicioProcessamento = null;
let finalProcessamento = null;

const veiculoForm = document.getElementById('veiculoForm');
const ticketContainer = document.getElementById('ticketContainer');
const fecharCaixaBtn = document.getElementById('fecharCaixaBtn');
const relatorioContainer = document.getElementById('relatorioContainer');

veiculoForm.addEventListener('submit', registrarVeiculo);
fecharCaixaBtn.addEventListener('click', fecharCaixa);

function registrarVeiculo(event) {
    event.preventDefault();

    const placa = document.getElementById('placa').value;
    const horaEntrada = document.getElementById('horaEntrada').value;
    const horaSaida = document.getElementById('horaSaida').value;
    
    if (veiculos.length === 0) {
        inicioProcessamento = new Date();
    }
    
    const [horaE, minE] = horaEntrada.split(':').map(Number);
    const [horaS, minS] = horaSaida.split(':').map(Number);
    
    const entradaDate = new Date();
    entradaDate.setHours(horaE, minE, 0, 0);
    
    const saidaDate = new Date();
    saidaDate.setHours(horaS, minS, 0, 0);
    
    if (saidaDate < entradaDate) {
        saidaDate.setDate(saidaDate.getDate() + 1);
    }
    
    const tempoMs = saidaDate - entradaDate;
    const tempoHoras = tempoMs / (1000 * 60 * 60);
    const velocidade = DISTANCIA / tempoHoras;
    
    let desconto = 0;
    
    if (velocidade <= 60) {
        desconto = VALOR_PEDAGIO * TAXA_ATE_60;
    } else if (velocidade <= 100) {
        desconto = VALOR_PEDAGIO * TAXA_ATE_100;
    } else {
        desconto = VALOR_PEDAGIO * TAXA_ACIMA_100;
    }
    
    const valorPago = VALOR_PEDAGIO - desconto;
    
    const veiculo = {
        placa,
        horaEntrada,
        horaSaida,
        tempo: tempoHoras,
        velocidade,
        valorPago
    };
    
    veiculos.push(veiculo);
    gerarTicket(veiculo);
    veiculoForm.reset();
}

function gerarTicket(veiculo) {
    const ticket = document.createElement('div');
    ticket.className = 'ticket';
    
    ticket.innerHTML = `
        <h3>Ticket de Pedágio - ${veiculo.placa}</h3>
        <div class="ticket-info">
            <div><strong>Hora de Entrada:</strong> ${veiculo.horaEntrada}</div>
            <div><strong>Hora de Saída:</strong> ${veiculo.horaSaida}</div>
            <div><strong>Tempo Gasto:</strong> ${veiculo.tempo.toFixed(2)} horas</div>
            <div><strong>Velocidade Média:</strong> ${veiculo.velocidade.toFixed(2)} km/h</div>
            <div><strong>Valor a Pagar:</strong> R$ ${veiculo.valorPago.toFixed(2)}</div>
        </div>
    `;
    
    ticketContainer.appendChild(ticket);
}

function fecharCaixa() {
    if (veiculos.length === 0) {
        alert('Nenhum veículo registrado para gerar relatório.');
        return;
    }
    
    finalProcessamento = new Date();
    
    const velocidades = veiculos.map(v => v.velocidade);
    const menorVelocidade = Math.min(...velocidades);
    const maiorVelocidade = Math.max(...velocidades);
    const mediaVelocidade = velocidades.reduce((a, b) => a + b, 0) / velocidades.length;
    const totalValores = veiculos.reduce((total, v) => total + v.valorPago, 0);
    
    const formatarHora = (date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };
    
    relatorioContainer.innerHTML = `
        <h2>Relatório do Turno</h2>
        <div class="relatorio-info">
            <div><strong>Menor Velocidade:</strong> ${menorVelocidade.toFixed(2)} km/h</div>
            <div><strong>Maior Velocidade:</strong> ${maiorVelocidade.toFixed(2)} km/h</div>
            <div><strong>Média de Velocidades:</strong> ${mediaVelocidade.toFixed(2)} km/h</div>
            <div><strong>Total Arrecadado:</strong> R$ ${totalValores.toFixed(2)}</div>
            <div><strong>Início do Processamento:</strong> ${formatarHora(inicioProcessamento)}</div>
            <div><strong>Final do Processamento:</strong> ${formatarHora(finalProcessamento)}</div>
            <div><strong>Total de Veículos:</strong> ${veiculos.length}</div>
        </div>
    `;
    
    relatorioContainer.style.display = 'block';
    relatorioContainer.scrollIntoView({ behavior: 'smooth' });
}