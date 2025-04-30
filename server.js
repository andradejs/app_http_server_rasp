const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3002;

// Variáveis globais para armazenar os últimos dados recebidos
let ultimoButton = null;
let ultimoSensor = null;
let ultimoX = null;
let ultimoY = null;
let ultimaPosition = "Centro";

function getPosition(x,y){
    const centro = 2048;
    const margem = 500; // a margem serve para determinar quando o jostick estiver no centro

    if (x < centro - margem && y > centro + margem) return "Noroeste";
    else if( x > centro + margem && y > centro + margem) return "Nordeste";
    else if( x < centro - margem && y < centro - margem) return "Sudoeste";
    else if ( x > centro + margem && y < centro - margem) return "Sudeste";
    else if ( x < centro - margem) return "Oeste";
    else if ( x > centro + margem) return "Leste";
    else if ( y < centro - margem ) return "Sul"; 
    else if ( y > centro + margem) return "Norte";

    return "Centro"; 
}

// Função para enviar dados para todos os clientes conectados
function broadcastData() {
    const data = {
        button: ultimoButton,
        sensor: ultimoSensor,
        x:ultimoX,
        y:ultimoY,
        position: ultimaPosition
    };
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
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
    ultimoX = parseInt(x,10);
    ultimoY = parseInt(y,10);
    ultimaPosition = getPosition(ultimoX,ultimoY);

    console.log(`Dados recebidos -> Botão: ${button}, Sensor: ${sensor}, x: ${x}, y: ${y}`);
    broadcastData(); // Envia os dados atualizados para os clientes conectados

    res.status(200).send("Dados recebidos com sucesso.");
});

// Rota para visualizar os últimos dados recebidos
app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname, "templates", "index.html"));
});

// Inicia o servidor
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://192.168.1.15:${port}`);
});
