const form = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput"); 
const messageList = document.getElementById("messages"); 

function handleSubmit(event) {
    event.preventDefault();
    const nameInput = event.target.nameInput.value;
    const messageInputValue = messageInput.value; 

    fetch('/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameInput, message: messageInputValue }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit message');
        }
        messageInput.value = '';
        fetchMessages();
    })
    .catch(error => console.error('Error:', error));
}

function createMessageElement(message) {
    const li = document.createElement('li');
    li.textContent = `${message.name}: ${message.message}`; 

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
        await fetch(`/messages/${message.id}`, { method: 'DELETE' });
        fetchMessages();
    });
    li.appendChild(deleteButton);

    // Like button
    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like';
    likeButton.addEventListener('click', async () => {
        await fetch(`/messages/${message.id}/like`, { method: 'POST' });
        fetchMessages();
    });
    li.appendChild(likeButton);

    // Display likes count
    const likesCount = document.createElement('span');
    likesCount.textContent = `Likes: ${message.likes}`;
    li.appendChild(likesCount);

    return li;
}

// Event listener for the form submission
form.addEventListener('submit', handleSubmit);

// Function to fetch messages from the server and display them
async function fetchMessages() {
    try {
        const response = await fetch('/messages');
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();

        messageList.innerHTML = '';
        messages.forEach(message => {
            const li = createMessageElement(message);
            messageList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initial fetch when the page loads
fetchMessages();
