---

# 📡 Servidor Node.js com Long Polling para Joystick e Sensor

Este projeto é um servidor Node.js com suporte a **long polling**, permitindo o envio de dados por um microcontrolador (como Raspberry Pi ou ESP32) e a atualização em tempo real de clientes aguardando novas informações.

---

## ✅ Funcionalidades

* Recebe dados via requisição HTTP (`GET /status`)
* Armazena e interpreta os dados `button`, `sensor`, `x`, `y`
* Determina a posição do joystick com base em `x` e `y`
* Utiliza **long polling** para enviar dados aos clientes que aguardam atualizações (`GET /poll`)
* Serve uma página HTML para visualização (`GET /`)

---

## 🚀 Tecnologias Utilizadas

* [Node.js](https://nodejs.org)
* [Express](https://expressjs.com)
* HTML (frontend simples)

---

## 📦 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
sudo node index.js
```

> ⚠️ A porta padrão utilizada é a `443`, portanto pode ser necessário rodar o servidor com privilégios de administrador (`sudo`).

---

## 🔁 Funcionamento do Long Polling

### 1. Envio de dados via `GET /status`

O microcontrolador envia os dados capturados do joystick e sensor usando a seguinte URL:

```
http://localhost:443/status?button=1&sensor=22.5&x=3000&y=1000
```

### 2. Recebimento dos dados via `GET /poll`

O cliente (navegador ou aplicação) faz uma requisição para aguardar novas atualizações:

```
http://localhost:443/poll
```

A resposta será enviada **somente quando novos dados forem recebidos** via `/status`.

---

## 📡 Parâmetros esperados em `/status`

| Parâmetro | Tipo   | Descrição                    |
| --------- | ------ | ---------------------------- |
| `button`  | string | Estado do botão (`0`, `1`)   |
| `sensor`  | string | Valor do sensor (ex: `22.5`) |
| `x`       | número | Posição X do joystick        |
| `y`       | número | Posição Y do joystick        |

---

## 🧠 Lógica de Posição do Joystick

A posição do joystick é determinada com base em valores `x` e `y` comparados ao ponto central `2048` com uma margem de `500`.

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

A rota `/` serve o arquivo `index.html`, que pode ser usado para exibir os dados recebidos de forma dinâmica.

> Certifique-se de que `index.html` esteja no mesmo diretório do arquivo `index.js`.

---

## 📂 Estrutura do Projeto

```
├── index.js        # Código principal do servidor
├── index.html      # Interface web para visualização dos dados
├── package.json    # Configurações do projeto e dependências
```

---

## 🧪 Teste com cURL

```bash
curl "http://localhost:443/status?button=1&sensor=25.6&x=1800&y=2500"
```

Em outro terminal, aguarde dados com:

```bash
curl "http://localhost:443/poll"
```

---

## 📄 Licença

Este projeto é licenciado sob a licença MIT. Fique à vontade para usar, modificar e distribuir.


