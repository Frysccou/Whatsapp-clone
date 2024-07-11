document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chat-list');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const contactName = document.getElementById('contact-name');
    const searchInput = document.getElementById('search-input');
    const createGroupButton = document.getElementById('create-group-button');
    const groupModal = document.getElementById('group-modal');
    const closeModalButton = document.getElementById('close-modal');
    const createGroup = document.getElementById('create-group');
    const groupNameInput = document.getElementById('group-name');
    const groupContacts = document.getElementById('group-contacts');

    let contacts = [
        'Juan Perez', 'Maria Lopez', 'Carlos Sanchez', 
        'Ana Martinez', 'Luis Garcia', 'Jose Rodriguez', 
        'Laura Gomez', 'Marta Diaz', 'Pedro Ramirez', 
        'Sandra Fernandez'
    ];

    let chats = {};

    let currentChat = null;

    const renderContacts = (filteredContacts = null) => {
        chatList.innerHTML = '';

        (filteredContacts || contacts).forEach(contact => {
            const chatElement = createChatElement(contact);
            chatList.appendChild(chatElement);
        });

        Object.keys(chats).forEach(groupName => {
            const chatElement = createChatElement(groupName);
            chatList.appendChild(chatElement);
        });

        if (!currentChat) {
            chatMessages.innerHTML = '';
            messageInput.style.display = 'none';
            sendButton.style.display = 'none';
        } else {
            messageInput.style.display = 'block';
            sendButton.style.display = 'block';
            renderChatMessages();
        }
    };

    const createChatElement = (name) => {
        const chatElement = document.createElement('div');
        chatElement.classList.add('chat');
        chatElement.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="${name}">
            <div class="contact-info">
                <div class="contact-name">${name}</div>
                <div class="recent-message">${getLastMessage(name)}</div>
            </div>
        `;
        chatElement.addEventListener('click', () => {
            openChat(name);
        });
        return chatElement;
    };

    const openChat = (name) => {
        contactName.textContent = name;
        currentChat = name;
        chatMessages.innerHTML = '';
        renderChatMessages();
        messageInput.style.display = 'block';
        sendButton.style.display = 'block';
    };

    const renderChatMessages = () => {
        chatMessages.innerHTML = '';
        if (chats[currentChat]) {
            chats[currentChat].forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', message.type);
                messageElement.textContent = message.text;
                chatMessages.appendChild(messageElement);
            });
        }
    };

    const getLastMessage = (name) => {
        if (chats[name] && chats[name].length > 0) {
            return chats[name][chats[name].length - 1].text;
        }
        return '';
    };

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

            const chatElements = Array.from(chatList.children);
            chatElements.forEach(element => {
                if (element.textContent.includes(currentChat)) {
                    const recentMessageElement = element.querySelector('.recent-message');
                    recentMessageElement.textContent = randomResponse;
                }
            });
        }, 1000);
    };

    const filterContacts = () => {
        const query = searchInput.value.toLowerCase();
        const filteredContacts = contacts.filter(contact => contact.toLowerCase().includes(query));
        renderContacts(filteredContacts);
    };

    const openGroupModal = () => {
        groupModal.style.display = 'flex';
        renderGroupContacts();
    };

    const closeGroupModal = () => {
        groupModal.style.display = 'none';
    };

    const renderGroupContacts = () => {
        groupContacts.innerHTML = '';
        contacts.forEach(contact => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = contact;
            checkbox.id = contact.replace(/\s/g, '-'); 
            const label = document.createElement('label');
            label.setAttribute('for', checkbox.id);
            label.textContent = contact;
            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            groupContacts.appendChild(div);
        });
    };

    const createGroupChat = () => {
        const groupName = groupNameInput.value.trim();
        if (groupName === '') return;

        const selectedContacts = Array.from(groupContacts.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedContacts.length === 0) return;

        chats[groupName] = [];

        chats[groupName].push({ type: 'received', text: `Grupo creado con ${selectedContacts.join(', ')}` });

        renderContacts(); 
        closeGroupModal();
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    searchInput.addEventListener('input', filterContacts);
    createGroupButton.addEventListener('click', openGroupModal);
    closeModalButton.addEventListener('click', closeGroupModal);
    createGroup.addEventListener('click', createGroupChat);

    renderContacts(); 
});