const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://localhost";
const EXCHANGE_NAME = "tea-time-exchange";

let channel;

// Connexion à RabbitMQ
async function connectRabbitMQ() {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
}

app.post('/api/wakeup', async (req, res) => {
    if (!channel) return res.status(500).send("RabbitMQ non connecté");

    const message = "it's tea time";
    channel.publish(EXCHANGE_NAME, '', Buffer.from(message));
    
    console.log(`📤 Message envoyé : ${message}`);
    res.send({ message: "Tea time broadcasted!" });
});

app.listen(3000, async () => {
    await connectRabbitMQ();
    console.log("✅ Producer API sur http://localhost:3000");
});