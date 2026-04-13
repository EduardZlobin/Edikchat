// Ждем, пока вся страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    let chatHistory = [];

    // Функция добавления сообщения
    function appendMessage(text, className) {
        if (!chatBox) return; // Защита от ошибки, если chat-box не найден
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Функция отправки
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user-msg');
        userInput.value = '';

        chatHistory.push({ role: "user", parts: [{ text: text }] });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory.slice(-6) })
            });

            const data = await response.json();
            
            if (data.reply) {
                appendMessage(data.reply, 'bot-msg');
                chatHistory.push({ role: "model", parts: [{ text: data.reply }] });
            }
        } catch (error) {
            console.error("Ошибка:", error);
            appendMessage("Ой , соколик , что-то связь барахлит...", "bot-msg");
        }
    }

    // Вешаем события только если кнопки существуют
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});