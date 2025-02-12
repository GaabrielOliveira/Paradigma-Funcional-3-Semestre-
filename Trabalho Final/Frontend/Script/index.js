const eventSource = new EventSource('http://localhost:5000/stream');
        const messagesDiv = document.getElementById('messages');
        const inputField = document.getElementById('messageInput');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            addMessageToUI(data.id, data.content);
        };

        function addMessageToUI(id, content) {
            const newMessage = document.createElement('div');
            newMessage.classList.add('message');
            newMessage.dataset.id = id;
            
            const messageText = document.createElement('span');
            messageText.textContent = content;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteMessage(id, newMessage);
            
            newMessage.appendChild(messageText);
            newMessage.appendChild(deleteButton);
            messagesDiv.appendChild(newMessage);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

    
        function sendMessage() {
            const content = inputField.value.trim();
            if (content === '') return;
            
            fetch('http://localhost:5000/add_message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            inputField.value = '';
        }

        function deleteMessage(id, messageElement) {
            fetch(`http://localhost:5000/delete_message/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    messageElement.remove();
                }
            });
        }

        inputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        