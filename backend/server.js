const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Новый клиент подключен');

  ws.send(JSON.stringify({
    type: "system",
    content: "Добро пожаловать в чат!"
  }));

  ws.on('message', message => {
    let msg;

    try {
      msg = JSON.parse(message);
      console.log('Получено сообщение: ', msg);

    } catch (e) {
      console.log('Произошла ошибка при обработке сообщения: ', e);
      return
    }

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));

      }
    });
  });

});

console.log('Сервер запущен на порту 8080');
