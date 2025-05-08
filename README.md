---

# 🌐 WebSocket Server para Joystick e Sensor (Node.js)

Este projeto implementa um servidor Node.js com suporte a WebSocket para receber, processar e transmitir dados de um joystick e sensor em tempo real. Ideal para aplicações com microcontroladores como Raspberry Pi ou ESP32 enviando dados via HTTP.

---

## ✅ Funcionalidades

* Recebe dados via requisição HTTP (`GET /status`)
* Processa e determina a posição do joystick com base em `x` e `y`
* Armazena os últimos dados recebidos (`button`, `sensor`, `x`, `y`, `position`)
* Envia dados atualizados a todos os clientes conectados via WebSocket
* Serve uma interface web simples (`index.html`) para exibição dos dados em tempo real

---

## 🚀 Tecnologias Utilizadas

* [Node.js](https://nodejs.org)
* [Express](https://expressjs.com)
* [ws (WebSocket)](https://www.npmjs.com/package/ws)
* HTML para a interface do cliente

---

## 📦 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/andradejs/app_http_server_rasp.git
cd seu-projeto

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
node index.js
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📡 Envio de Dados

### Endpoint: `GET /status`

Envie dados do joystick e sensor usando parâmetros na URL.

**Exemplo:**

```
http://localhost:3000/status?button=1&sensor=22.5&x=3000&y=1000
```

### Parâmetros esperados:

| Parâmetro | Tipo   | Descrição                      |
| --------- | ------ | ------------------------------ |
| button    | string | Estado do botão (ex: `1`, `0`) |
| sensor    | string | Valor do sensor (ex: `22.5`)   |
| x         | número | Posição X do joystick          |
| y         | número | Posição Y do joystick          |

---

## 🔄 Transmissão via WebSocket

Todos os clientes conectados por WebSocket recebem automaticamente os dados mais recentes sempre que há uma atualização.

### Formato da mensagem enviada:

```json
{
  "button": "1",
  "sensor": "22.5",
  "x": 3000,
  "y": 1000,
  "position": "Sudeste"
}
```

---

## 📍 Lógica de Posição do Joystick

A posição é determinada com base nos valores `x` e `y` do joystick em relação a uma zona central (`centro = 2048`, `margem = 500`).

| Posição  | Condição                                  |
| -------- | ----------------------------------------- |
| Norte    | y > centro + margem                       |
| Sul      | y < centro - margem                       |
| Leste    | x > centro + margem                       |
| Oeste    | x < centro - margem                       |
| Nordeste | x > centro + margem e y > centro + margem |
| Noroeste | x < centro - margem e y > centro + margem |
| Sudeste  | x > centro + margem e y < centro - margem |
| Sudoeste | x < centro - margem e y < centro - margem |
| Centro   | Dentro da margem em relação ao centro     |

---

## 🖥️ Interface Web

A página `index.html` é servida na rota `/` e exibe os dados em tempo real utilizando WebSocket.

> Certifique-se de que o arquivo `index.html` esteja no mesmo diretório que o `index.js`.

---

## 📂 Estrutura do Projeto

```
├── index.js        # Código principal do servidor
├── index.html      # Interface web para visualização dos dados
├── package.json    # Configuração do projeto e dependências
```

---

## 🧪 Teste com cURL

```bash
curl "http://localhost:3000/status?button=0&sensor=23.1&x=2100&y=1200"
```

---

## 📄 Licença

Este projeto é licenciado sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.


