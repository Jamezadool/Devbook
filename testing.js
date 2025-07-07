const chatsContainer = document.querySelector(".chats");
let username = users.map(user => {
    let { username } = user;
    let name = username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    let initials = username.split(' ').map(initial => initial.charAt(0)).join("").toUpperCase();
    return `<div class="chat" data-username="${username.split(" ").map(userletter => userletter.charAt(0).toUpperCase() + userletter.slice(1).toLowerCase()).join(" ")}">
                <div class="image">${initials}</div>
                <div class="username">${name}</div>
            </div>`
}).join("");

chatsContainer.innerHTML += username;

//adding swipe for android and ios
const container = document.getElementById('messagesContainer');            
function addSwipeListener(element, onSwipeLeft, onSwipeRight){
    let touchStartX = 0;
    let touchEndX = 0;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe(){
        const deltaX = touchEndX - touchStartX;
        const minSwipeDistance = 50;

        if(Math.abs(deltaX) > minSwipeDistance){
            if(deltaX < 0){
                onSwipeLeft();
            }else{
                onSwipeRight();
            }
        }
    }
}

addSwipeListener(container, () => {
    // console.log("Swiped Left");
}, () => {
    // console.log("Swiped Right");
    const chatContainer = document.querySelector(".container");
    chatContainer.style.transform = "translateX(0)";
});


//the next step is making sure on each click chats belonging to the particular room is gotten. understood
