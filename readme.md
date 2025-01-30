# 🚀 Tea-Time Messaging with WebSocket & RabbitMQ

Ce projet met en place **deux applications Node.js** qui communiquent via **RabbitMQ** et **WebSocket**.  
L'objectif est d'envoyer un message `"it's tea time"` via une requête API et le diffuser à tous les clients WebSocket connectés.

---

## 📌 Architecture
- **Producer (App 1)** : Expose une API REST `POST /api/wakeup` qui envoie un message à RabbitMQ.
- **Consumer (App 2)** : Écoute RabbitMQ et diffuse le message à tous les clients WebSocket connectés.

---

## 📦 Pré-requis
1. **Node.js** installé ([Téléchargement](https://nodejs.org/))
2. **RabbitMQ** installé **ou** lancé via Docker

---

## Lancer les projets

```sh
npm run producer
```


```sh
npm run copnsumer
```