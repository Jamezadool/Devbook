
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

// Add some interactivity to posts
document.addEventListener('DOMContentLoaded', function () {
    const postActions = document.querySelectorAll('.post-action');
    postActions.forEach(action => {
        action.addEventListener('click', function () {
            // Add a subtle animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Simulate interaction
            const emoji = this.querySelector('.emoji'); //this affects all the posts action btn like upvote, share, comment,.
            const liked = this.dataset.liked === "true";

            emoji.textContent = liked ? '👍' : '❤️';
            this.dataset.liked = liked ? 'false' : "true";
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
function checkOverflow(){
    postsContent.forEach(content => {
        const postText = content.querySelector('.post-content');
        const parent = content.offsetHeight;
        const moreBtn = content.querySelector('.see-more');
        const child = postText.scrollHeight;
        const evaluation = child > parent;
        // console.log(`Parent: ${parent}, Child: ${postText.scrollHeight}`)
        moreBtn.style.display = evaluation ? 'inline' : 'none';
        // console.log(evaluation ? 'Greater' : ' Lesser');
        postText.addEventListener("click", function(){
            // alert("clicked");
            this.classList.toggle('expanded');
            const classContain = this.classList.contains('expanded');
            moreBtn.textContent = classContain ? '...See Less' : '...See More';
        })
    })
}
checkOverflow();

// window.addEventListener('resize', checkOverflow);
// window.addEventListener('DOMContentLoaded', checkOverflow)

const sideBar = document.querySelector(".sidebar");
const menuBtn = document.querySelector(".menu-icon");

menuBtn.addEventListener("click", function(){
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

   localStorage.setItem('theme', document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
})

function loadTheme(){
    const theme = localStorage.getItem('theme') === 'light';
    document.documentElement.classList.add(theme ? 'light-mode' : 'dark-mode');
    toggle.style.marginLeft = document.documentElement.classList.contains('light-mode') ? '0' : '50%';
    toggle.style.background = document.documentElement.classList.contains('light-mode') ? 'var(--devnote-gray)' : 'var(--devnote-blue)';
}
loadTheme();

//close the sidebar if users clicks anywhere outside of it
document.addEventListener("click", (event) => {
    if(!sideBar.contains(event.target) && event.target !== menuBtn) {
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
})