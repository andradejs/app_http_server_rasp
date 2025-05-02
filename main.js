const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.createServer(app);
const port = 443;

// Variáveis globais para armazenar os últimos dados recebidos
let ultimoButton = null;
let ultimoSensor = null;
let ultimoX = null;
let ultimoY = null;
let ultimaPosition = "Centro";
let waitingClients = []; // Lista de clientes aguardando atualizações

function getPosition(x, y) {
    const centro = 2048;
    const margem = 500; // a margem serve para determinar quando o joystick estiver no centro

    if (x < centro - margem && y > centro + margem) return "Noroeste";
    else if (x > centro + margem && y > centro + margem) return "Nordeste";
    else if (x < centro - margem && y < centro - margem) return "Sudoeste";
    else if (x > centro + margem && y < centro - margem) return "Sudeste";
    else if (x < centro - margem) return "Oeste";
    else if (x > centro + margem) return "Leste";
    else if (y < centro - margem) return "Sul";
    else if (y > centro + margem) return "Norte";

    return "Centro";
}

// Função para enviar dados para todos os clientes em espera
function notifyClients() {
    const data = {
        button: ultimoButton,
        sensor: ultimoSensor,
        x: ultimoX,
        y: ultimoY,
        position: ultimaPosition
    };
    waitingClients.forEach(res => res.json(data));
    waitingClients = []; // Limpa a lista de clientes após notificar
}

// Rota que o Raspberry chama para enviar os dados
app.get('/status', (req, res) => {
    const { button, sensor, x, y } = req.query;

    if (button === undefined || sensor === undefined || x === undefined || y === undefined) {
        return res.status(400).send("Dados inválidos");
    }

    // Atualiza os dados armazenados
    ultimoButton = button;
    ultimoSensor = sensor;
    ultimoX = parseInt(x, 10);
    ultimoY = parseInt(y, 10);
    ultimaPosition = getPosition(ultimoX, ultimoY);

    console.log(`Dados recebidos -> Botão: ${button}, Sensor: ${sensor}, x: ${x}, y: ${y}`);
    notifyClients(); // Notifica os clientes aguardando

    res.status(200).send("Dados recebidos com sucesso.");
});

// Rota para os clientes consultarem atualizações
app.get('/poll', (req, res) => {
    waitingClients.push(res); // Adiciona a resposta à lista de espera
});

// Rota para visualizar os últimos dados recebidos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Inicia o servidor
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});
