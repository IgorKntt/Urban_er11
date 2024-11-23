const chat = document.getElementById('chat');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

let UserName = "";

while (UserName === "" || UserName === null) {
  // alert(UserName);
  UserName = prompt("Введите свое имя");
  // alert(UserName);
}

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log("Подключение успешно");

};


socket.onmessage = event => {
  const message = JSON.parse(event.data);
  showMessage(message);
}

socket.onclose = event => {
  if (event.wasClean) {
    console.log(`Соединение закрыто. Код: ${event.code} причина: ${event.reason}`);
  } else {
    console.log('Соединение прервано');
  }
};

socket.onerror = error => {
  console.log(`Ошибка: ${error.message}`);
};

messageForm.onsubmit = e => {
  e.preventDefault();
  if (messageInput.value.trim()) {
    const message = {
      userName: UserName,
      type: 'user',
      content: messageInput.value.trim()
    };
    socket.send(JSON.stringify(message));
    messageInput.value = "";
  }
}


function showMessage(message) {
  const messageElement = document.createElement('div');

  if (message.type === 'system') {
    messageElement.classList.add("systemMessage");
  }

  if (message.userName && message.userName === UserName) {
    messageElement.classList.add("message", "myMessage");
  } else if (message.userName && message.userName !== UserName) {
    messageElement.classList.add("message", "userMessage");
    messageElement.innerHTML = `<p class="userName">${message.userName}: </p>`;
  }

  messageElement.innerHTML += `<p>${message.content}</p>`;
  chat.append(messageElement);
  chat.scrollTop = chat.scrollHeight;
}
