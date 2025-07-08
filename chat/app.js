let messageCount = 0;

function toggleAttachmentMenu() {
    const menu = document.getElementById('attachmentMenu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function openCamera() {
    document.getElementById('cameraInput').click();
    toggleAttachmentMenu();
}

function openPhotoLibrary() {
    document.getElementById('photoInput').click();
    toggleAttachmentMenu();
}

function openDocuments() {
    document.getElementById('documentInput').click();
    toggleAttachmentMenu();
}

function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            addMessage(`📍 Location: ${lat}, ${lng}`, 'sent');
        });
    } else {
        addMessage('📍 Current Location', 'sent');
    }
    toggleAttachmentMenu();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        if (file.type.startsWith('image/')) {
            addImageMessage(e.target.result, file.name);
        } else {
            addFileMessage(file.name, formatFileSize(file.size));
        }
    };
    reader.readAsDataURL(file);
}

function addImageMessage(src, name) {
    const container = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble image-message';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    
    bubbleDiv.appendChild(img);
    messageDiv.appendChild(bubbleDiv);
    container.appendChild(messageDiv);
    addTimeStamp();
    scrollToBottom();
}

function addFileMessage(name, size) {
    const container = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-message';
    fileDiv.innerHTML = `
        <div class="file-icon">📄</div>
        <div class="file-info">
            <div class="file-name">${name}</div>
            <div class="file-size">${size}</div>
        </div>
    `;
    
    bubbleDiv.appendChild(fileDiv);
    messageDiv.appendChild(bubbleDiv);
    container.appendChild(messageDiv);
    addTimeStamp();
    scrollToBottom();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const socket = io("http://127.0.0.1:3000");


socket.on("connect", () => {
    console.log("connected to backend");
})
socket.on("disconnect", () => {
    console.log("Client disconnected");
})

// socket.on("Received message", (msg) => {
//     addMessage(msg, 'received');
// })

// function sendMessage() {
//     const input = document.getElementById('messageInput');
//     const message = input.value.trim();
//     if (message) {
//         try{
//             if(socket.emit("chat message", message)){
//                 addMessage(message, 'sent');
//                 input.value = '';
//                 adjustTextareaHeight();
//             }else{
//                 console.log("Maybe socket failed");
//             }
//         }catch(err)
//         {
//             console.log(err);
//         }
        
//     }
// }
// this works for broadcasting message... which might be useful for posting.

function generateRoomID(user1, user2){
    return [user1, user2].sort().join('_');   
}
const currentUser = localStorage.getItem("username");

if(!currentUser) {
    currentUser = prompt("Enter your username");
    localStorage.setItem("username", currentUser);
}
const targetUser = localStorage.getItem("targetuser");
window.addEventListener("DOMContentLoaded", () => {
    contactName.innerHTML = targetUser || "Unknown user";
});
const chatList = document.querySelectorAll(".chat");
const contactName = document.querySelector(".contact-name");

let roomID = generateRoomID(currentUser, targetUser);
chatList.forEach(chat => 
    chat.addEventListener("click", () => {
        const targetUser = chat.dataset.username;
        localStorage.setItem("targetuser", targetUser);
        contactName.innerHTML = targetUser;
        roomID = generateRoomID(currentUser, targetUser);
        socket.emit("join room", roomID);
        const deviceWidth = document.documentElement.clientWidth;
        const values = deviceWidth < 400;
        const chatContainer = document.querySelector(".container");
        const backBtn = document.querySelector(".back-btn");
        if(values){
            chatContainer.style.transform = "translateX(-100vw)";
        }
        backBtn.addEventListener("click", () => {
            chatContainer.style.transform = "translateX(0)";
        })
    })
);


console.log("Joined room: ", roomID);

function sendMessage(){
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    socket.emit("chat message", {roomID, msg: message, currentUser});
    addMessage(message, 'sent');
    input.value = "";
}

socket.on("chat message", (msg) => {
    addMessage(msg, 'received');
});

function addMessage(text, type) {
    addTimeStamp();
    const container = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const userimg = document.createElement('div');
    userimg.textContent = "JD";
    userimg.classList.add('avatar');

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(userimg);
    messageDiv.appendChild(bubbleDiv);
    container.appendChild(messageDiv);
    
    scrollToBottom();
}

function addTimeStamp() {
    const container = document.getElementById('messagesContainer');
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeDiv.textContent = time;
    
    container.appendChild(timeDiv);
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    const container = document.getElementById('messagesContainer');
    
    // Move typing indicator to the end of messages
    container.appendChild(indicator);
    indicator.style.display = 'flex';
    indicator.style.flexDirection = 'column';
    indicator.style.alignItems = 'flex-start';
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

function getRandomResponse() {
    const responses = [
        "That sounds great!",
        "I totally agree with you",
        "Interesting point!",
        "Let me think about that",
        "Sure, that works for me",
        "Thanks for sharing!",
        "I see what you mean",
        "That's a good idea"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    container.scrollTop = container.scrollHeight;
}

function adjustTextareaHeight() {
    const textarea = document.getElementById('messageInput');
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

// Event listeners
document.getElementById('messageInput').addEventListener('input', adjustTextareaHeight);
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Close attachment menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('attachmentMenu');
    const btn = document.querySelector('.attachment-btn');
    
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// Initialize
scrollToBottom();
