require('dotenv').config();
const WebSocket = require('ws');

const port = process.env.WS_PORT;
const server = new WebSocket.Server({ port: port });

const messages = [];
const clients = new Set();

server.on('connection', ws => {
	clients.add(ws);
	ws.send(JSON.stringify(messages));

	ws.on('message', message => {
		messages.push(JSON.parse(message));

		clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(messages));
			}
		});

		ws.on('close', () => {
			clients.delete(ws);
		});
	});
});
