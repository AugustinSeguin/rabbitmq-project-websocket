const amqp = require('amqplib');
const WebSocket = require('ws');

const RABBITMQ_URL = "amqp://localhost";
const EXCHANGE_NAME = "tea-time-exchange";
const wss = new WebSocket.Server({ port: 8080 });

let channel;
let clients = [];

// Connexion WebSocket
wss.on('connection', (ws) => {
    console.log("🟢 Nouveau client connecté");
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log("🔴 Client déconnecté");
    });
});

// Connexion à RabbitMQ
async function connectRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, EXCHANGE_NAME, '');

    channel.consume(q.queue, (msg) => {
        if (msg.content) {
            const message = msg.content.toString();
            console.log(`📥 Message reçu : ${message}`);

            // Broadcast aux WebSocket
            clients.forEach(client => client.send(message));
        }
    }, { noAck: true });

    console.log("✅ Consumer connecté à RabbitMQ");
}

connectRabbitMQ();
