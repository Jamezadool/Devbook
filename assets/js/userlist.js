//this would show user list, it would be used to set the target users

const listContainer = document.querySelector('.chat-list-container');
let username = users.map(user => {
    let { username, lastMessage } = user;
    return ` <div class="chats-list" data-username="${username.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}">
                <div class="chats-list-avatar">${username.split(" ").map(words => words.charAt(0).toUpperCase()).join("")}</div>
                <div class="chat-content-preview">
                    <div class="username">${username.split(" ").map(words => words.charAt(0).toUpperCase() + words.slice(1).toLowerCase()).join(" ")}</div>
                    <div class="last-message">${lastMessage}</div>
                </div>
            </div>`;
}).join('');

listContainer.innerHTML += username;

//Generate room & fetch contact name Id function came from chat.js 
const userAvatar = document.querySelector('.contact-avatar');
const ChatLists = document.querySelectorAll('.chats-list');
ChatLists.forEach(chats => {
    chats.addEventListener("click", function(){
        chatsContainer.classList.add('open-message');
        targetuser = this.dataset.username;
        localStorage.setItem("targetuser", targetuser);
        fetchContactName(targetuser);
        roomID = generateRoomID(currentUser, targetUser);
        socket.emit("join room", roomID);
    });
});
