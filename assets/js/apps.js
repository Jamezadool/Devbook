//Add a token to the head of this file so anytime users login it would confirm from the database to allow them and if not for example they went into the index page directly it should stop them and throw them out... you know what, don't do that. make the posts be viewable, like they can use the homepage but won't be able to comment or read comment, as they haven't logged in, just give them like 20posts to view and ask them to login to access more function.
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Update nav icons
    const navIcons = document.querySelectorAll('.nav-icon');
    navIcons.forEach(icon => icon.classList.remove('active'));

    const sidebarIcon = document.querySelectorAll('.sidebar-item');
    sidebarIcon.forEach(sideIcon => sideIcon.classList.remove('active'));

    // Add active class to clicked icon
    event.target.classList.add('active');
}

// Add some interactivity to posts like Btn
document.addEventListener('DOMContentLoaded', function () {
    const postActions = document.querySelectorAll('.post-action');
    postActions.forEach(action => {
        action.addEventListener('click', function () {
            if (action.dataset.liked) {
                // Add a subtle animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                // Simulate interaction
                const emoji = this.querySelector('.emoji-liked');
                const liked = this.dataset.liked === "true";

                emoji.textContent = liked ? '👍' : '❤️';
                this.dataset.liked = liked ? 'false' : "true";
            }
        });
    });

    // Post button functionality
    const postBtn = document.querySelector('.post-btn');
    const postInput = document.querySelector('.post-input');

    postBtn.addEventListener('click', function () {
        if (postInput.value.trim()) {
            // Create new post (simplified)
            alert('Post created successfully! 🎉');
            postInput.value = '';
        }
    });
});

const postsContent = document.querySelectorAll('.post-content-container');
function checkOverflow() {
    postsContent.forEach(content => {
        const postText = content.querySelector('.post-content');
        const parent = content.offsetHeight;
        const moreBtn = content.querySelector('.see-more');
        const child = postText.scrollHeight;
        const evaluation = child > parent;
        // console.log(`Parent: ${parent}, Child: ${postText.scrollHeight}`)
        moreBtn.style.display = evaluation ? 'inline' : 'none';
        // console.log(evaluation ? 'Greater' : ' Lesser');
        postText.addEventListener("click", function () {
            // alert("clicked");
            this.classList.toggle('expanded');
            const classContain = this.classList.contains('expanded');
            moreBtn.textContent = classContain ? '...See Less' : '...See More';
        })
    })
}
window.addEventListener('resize', checkOverflow);
window.addEventListener('DOMContentLoaded', checkOverflow)

const sideBar = document.querySelector(".sidebar");
const menuBtn = document.querySelector(".menu-icon");

menuBtn.addEventListener("click", function () {
    sideBar.classList.toggle('active');
    const showedSideBar = sideBar.classList.contains('active');
    menuBtn.textContent = showedSideBar ? 'x' : '=';
})

//theme handler
const toggler = document.querySelector('.theme-controller');
const toggle = document.querySelector('.toggle div');
toggler.addEventListener("click", () => {
    document.documentElement.classList.toggle('light-mode');
    toggle.style.marginLeft = document.documentElement.classList.contains('light-mode') ? '0' : '50%';
    toggle.style.background = document.documentElement.classList.contains('light-mode') ? 'var(--devnote-gray)' : 'var(--devnote-blue)';
    toggle.style.boxShadow = document.documentElement.classList.contains('light-mode') ? 'unset' : '0 0 10px var(--devnote-blue), 0 0 20px var(--devnote-blue)';
    localStorage.setItem('theme', document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
})

//load user theme on window load;
function loadTheme() {
    const theme = localStorage.getItem('theme') === 'light';
    document.documentElement.classList.add(theme ? 'light-mode' : '');
    toggle.style.marginLeft = document.documentElement.classList.contains('light-mode') ? '0' : '50%';
    toggle.style.background = document.documentElement.classList.contains('light-mode') ? 'var(--devnote-gray)' : 'var(--devnote-blue)';
    toggle.style.boxShadow = document.documentElement.classList.contains('light-mode') ? 'unset' : '0 0 10px var(--devnote-blue),0 0 20px var(--devnote-blue)';
}
window.addEventListener("DOMContentLoaded", loadTheme);

//close the sidebar if users clicks anywhere outside of it
document.addEventListener("click", (event) => {
    if (!sideBar.contains(event.target) && event.target !== menuBtn) {
        sideBar.classList.remove('active');
        const showedSideBar = sideBar.classList.contains('active');
        menuBtn.textContent = showedSideBar ? 'x' : '=';
    }
});
//open the settings div
const settings = document.querySelector('.settings');
const settingsDropdown = document.querySelector('.settings-dropdown');

settings.addEventListener("click", () => {
    settingsDropdown.classList.toggle('active');

    settings.style.background = settingsDropdown.classList.contains('active') ? 'var(--devnote-accent)' : 'var(--devnote-primary)';
});

//this should show posts on click even if it's the image;
function showSinglePost() {
    const posts = document.querySelectorAll('.show-single');
    const singlePost = document.querySelector('#single-post');
    const home = document.querySelector('#home');
    posts.forEach(post => {
        post.addEventListener("click", (event) => {
            const moreBtn = post.querySelector('.see-more');
            if (!moreBtn.contains(event.target)) {
                showPost(home, singlePost);
            }
        });
    });
}
showSinglePost();

function showPost(beforeElement, element) {
    beforeElement.classList.remove('active');
    element.classList.add('active');
}
function commentBtn() {
    const commentsBtn = document.querySelectorAll('.post-action');
    const home = document.querySelector('#home');
    const singlePost = document.querySelector('#single-post');
    commentsBtn.forEach(commentBtn => {
        commentBtn.addEventListener("click", function (event) {
            const showComment = this.dataset.comment;
            if (showComment) {
                showPost(home, singlePost);
            }
        });
    });
}
commentBtn();
//this will make the messaging on pc / larger screen not show in a differnt page, but comedown in a dropdown on the right;
const messageDiv = document.querySelector('.chat-message');
document.querySelectorAll('.message-chat').forEach(button => {
    button.addEventListener("click", () => {
        messageDiv.classList.toggle('active');
        button.style.background = messageDiv.classList.contains('active') ? 'var(--devnote-blue)' : '';
        // Update nav icons
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach(icon => icon.classList.remove('active'));
        askusername();
        localStorage.getItem("targetuser");
    });
});

//close the message interface if anyother btn is clicked.. i cant get it to work for all btns, so i made it work for smaller screens only.
document.addEventListener("click", (e) => {
    const deviceWidth = document.documentElement.clientWidth;
    if (deviceWidth < 530) {
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach(icons => {
            const messageBtn = document.querySelector(".mobile-message");
            if (icons.contains(e.target) && e.target !== messageBtn) {
                messageDiv.classList.remove(messageDiv.classList.contains('active') ? 'active' : 'active');
                messageBtn.style.background = messageDiv.classList.contains('active') ? 'var(--devnote-blue)' : '';
            }
        })
    }
})

//to make each userlist open up the messaging interface
const chatsContainer = document.querySelector('.chats-container');
document.querySelector('.back-btn').addEventListener('click', () => {
    chatsContainer.classList.remove('open-message');
});