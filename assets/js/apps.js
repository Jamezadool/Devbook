document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        location.href = '/auth/index.html';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/authorize', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            // Handle 401/403 status codes
            throw new Error("Not authorized");
        }

        const data = await res.json();
        if (!data.success) {
            throw new Error("Invalid auth");
        }

        console.log("Authenticated");

    } catch (err) {
        console.warn("Auth failed:", err.message);
        location.href = '/auth/index.html';
    }
});


// Scrolling windows to the top. 
const postScrollBtn = document.querySelector('.create-post-default-btn');
postScrollBtn.addEventListener("click", scrollToTop);
function scrollToTop() {
    scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.post-input').focus();
};

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
});

function checkOverflow() {
    const postsContent = document.querySelectorAll('.post-content-container');

    postsContent.forEach(content => {
        const postText = content.querySelector('.post-content');
        const moreBtn = content.querySelector('.see-more');

        // Remove any existing click listeners
        postText.removeEventListener('click', toggleExpand);
        moreBtn.removeEventListener('click', toggleExpand);

        // Reset to collapsed state
        postText.classList.remove('expanded');

        // Use a more reliable method to check if text is clamped
        const isTextClamped = postText.scrollHeight > postText.clientHeight;

        if (isTextClamped) {
            moreBtn.style.display = 'inline-block';
            moreBtn.textContent = '...See More';
        } else {
            moreBtn.style.display = 'none';
        }

        // Add click listeners
        function toggleExpand(e) {
            e.preventDefault();
            postText.classList.toggle('expanded');
            const isExpanded = postText.classList.contains('expanded');
            moreBtn.style.display = isExpanded ? 'none' : 'inline';
        }

        postText.addEventListener('click', toggleExpand);
        moreBtn.addEventListener('click', toggleExpand);
    });
}

// Run after DOM is loaded and after a short delay to ensure CSS is applied
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(checkOverflow, 100);
});

window.addEventListener('resize', checkOverflow);

const sideBar = document.querySelector(".sidebar");
const menuBtn = document.querySelector(".menu-icon");

menuBtn.addEventListener("click", function () {
    sideBar.classList.toggle('active');
    const showedSideBar = sideBar.classList.contains('active');
    menuBtn.textContent = showedSideBar ? 'x' : '=';
});

//close the sidebar if users clicks anywhere outside of it
document.addEventListener("click", (event) => {
    if (!sideBar.contains(event.target) && event.target !== menuBtn) {
        sideBar.classList.remove('active');
        const showedSideBar = sideBar.classList.contains('active');
        menuBtn.textContent = showedSideBar ? 'x' : '=';
    }
});

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

//get the header for future use
const header = document.querySelector('.header');
//this will make the messaging on pc / larger screen not show in a differnt page, but comedown in a dropdown on the right;
const messageDiv = document.querySelector('.chat-message');
document.querySelectorAll('.message-chat').forEach(button => {
    button.addEventListener("click", () => {
        messageDiv.classList.toggle('active');
        button.style.background = messageDiv.classList.contains('active') ? 'var(--devnote-blue)' : '';
        const deviceWidth = document.documentElement.clientWidth;
        if (deviceWidth < 530) {
            header.style.display = messageDiv.classList.contains('active') ? 'none' : 'block';
        }
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
                header.style.display = messageDiv.classList.contains('active') ? 'block' : 'block';
            }
        })
    }
})

//to make each userlist open up the messaging interface
const chatsContainer = document.querySelector('.chats-container');
document.querySelector('.back-btn').addEventListener('click', () => {
    chatsContainer.classList.remove('open-message');
});