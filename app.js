document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chat-list');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const contactName = document.getElementById('contact-name');
    const searchInput = document.getElementById('search-input');

    const contacts = [
        'Juan Perez', 'Maria Lopez', 'Carlos Sanchez', 
        'Ana Martinez', 'Luis Garcia', 'Jose Rodriguez', 
        'Laura Gomez', 'Marta Diaz', 'Pedro Ramirez', 
        'Sandra Fernandez'
    ];

    let currentChat = '';
    let chats = {};

    // Función para renderizar la lista de contactos
    const renderContacts = (filteredContacts = contacts) => {
        chatList.innerHTML = '';
        filteredContacts.forEach(contact => {
            const chatElement = document.createElement('div');
            chatElement.classList.add('chat');
            chatElement.innerHTML = `
                <img src="https://via.placeholder.com/40" alt="${contact}">
                <div>${contact}</div>
            `;
            chatElement.addEventListener('click', () => {
                openChat(contact);
            });
            chatList.appendChild(chatElement);
        });
    };

    // Función para abrir un chat
    const openChat = (name) => {
        contactName.textContent = name;
        currentChat = name;
        chatMessages.innerHTML = '';

        if (chats[name]) {
            chats[name].forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', message.type);
                messageElement.textContent = message.text;
                chatMessages.appendChild(messageElement);
            });
        }
    };

    // Función para enviar un mensaje
    const sendMessage = () => {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        if (!chats[currentChat]) {
            chats[currentChat] = [];
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.textContent = messageText;
        chatMessages.appendChild(messageElement);
        
        chats[currentChat].push({ type: 'sent', text: messageText });

        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Responder con un mensaje aleatorio
        setTimeout(() => {
            const responses = [
                'Hola, ¿cómo estás?',
                '¡Qué interesante!',
                'Dime más...',
                'No entiendo, ¿puedes repetir?',
                '¡Eso suena genial!'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseElement = document.createElement('div');
            responseElement.classList.add('message', 'received');
            responseElement.textContent = randomResponse;
            chatMessages.appendChild(responseElement);

            chats[currentChat].push({ type: 'received', text: randomResponse });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    };

    // Función para filtrar contactos
    const filterContacts = () => {
        const query = searchInput.value.toLowerCase();
        const filteredContacts = contacts.filter(contact => contact.toLowerCase().includes(query));
        renderContacts(filteredContacts);
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    searchInput.addEventListener('input', filterContacts);

    renderContacts();
});