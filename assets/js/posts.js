const fileContainer = document.querySelector('.inputed-files');
const fileSecondContainer = document.querySelector('.inputed-file');
const postsOptions = document.querySelectorAll('.post-option');
postsOptions.forEach(options => {
    options.addEventListener("click", function () {
        const fileType = this.dataset.file;
        document.getElementById(`${fileType}`).click();
    })
})

//Read the file and make it addable to the ui
function handlePostFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        if (file.type.startsWith('image/')) {
            addImageToPost(e.target.result, file.name);
        } else {
            addFileToPost(file.name, formatFileSize(file.size));
        }
    }
    reader.readAsDataURL(file);
    fileContainer.classList.add('active');
}

//Create a div to contain the selected image on the ui
function addImageToPost(src, name) {
    const div = document.createElement('div');
    div.className = "image-post"
    div.innerHTML = `<div class="files">
                            <button class="delbtn">X</button>
                            <img src="${src}" alt="${name}" class="file">
                        </div>`
    fileSecondContainer.appendChild(div);
}

fileSecondContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains('delbtn')) {
        const img = e.target.closest('.image-post');// this gets the closest parent to the element, thats if i didn't pass any thing in the ()
        img.remove(); // the remove function removes the element;
    }
});

//Creates a div to contain the selected file on the ui
function addFileToPost(name, size) {
    const div = document.createElement('div');
    div.className = "image-post"
    div.innerHTML = `<div class="files-file">
                        <button class="delbtn">X</button>
                        <div class="file-icon">📄</div>
                        <div class="file-info">
                            <div class="file-name">${name}</div>
                            <div class="file-size">${size}</div>
                        </div>
                    </div>`
    fileSecondContainer.appendChild(div);
}
//This gets the file size so it can be shown in the ui. for files only.
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

//load posts from the db
document.addEventListener('DOMContentLoaded', loadPosts);
async function loadPosts() {
    try {
        const res = await fetch('http://localhost:3000/posts');
        const data = await res.json();

        if (data.success) {
            const container = document.querySelector('#posts-home');
            container.innerHTML = '';
            data.posts.forEach(post => {
                const fullContent = post.content.trim();
                const shortContent = fullContent.slice(0, 150);
                const div = document.createElement('div');
                const colors = ['#e74c3c, #f39c12', '#2ecc71, #3498db', '#9b59b6, #e67e22', '#34495e, #2c3e50'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                div.innerHTML = `
                    <div class="post" data-id=${post.id}>
                        <div class="posts-container">
                            <div class="avatar" style="background: linear-gradient(45deg, ${randomColor})">${post.username.split(" ").map(word => word.charAt(0))}</div>
                            <div class="main-post-content">
                                <div class="post-header">
                                    <div class="post-info">
                                        <h3>${post.username}</h3>
                                        <h3>@${post.username}</h3>
                                        <div class="post-time">${new Date(post.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div class="show-single">
                                    <div class="post-content-container">
                                            <div class="post-content more">
                                                ${post.content}
                                            </div>
                                            <button class="see-more">...See More</button>
                                        </div>
                                    ${post.image_url ? `<div class="post-image"><img src="${post.image_url}" class="post-image" alt="${post.image_url}"></div>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="post-actions-bar">
                            <div class="post-action" data-liked="false">
                                <div class="emoji-liked"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l7 8h-4v8h-6v-8H5l7-8z"/>
    </svg>
    </div> <span>Upvote</span>
                            </div>
                            <div class="post-action comment-btn" onclick="openPost(${post.id})">
                                <div class="emoji-comment"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M5.821 4.91c3.899 -2.765 9.468 -2.539 13.073 .535c3.667 3.129 4.168 8.238 1.152 11.898c-2.841 3.447 -7.965 4.583 -12.231 2.805l-.233 -.101l-4.374 .931l-.04 .006l-.035 .007h-.018l-.022 .005h-.038l-.033 .004l-.021 -.001l-.023 .001l-.033 -.003h-.035l-.022 -.004l-.022 -.002l-.035 -.007l-.034 -.005l-.016 -.004l-.024 -.005l-.049 -.016l-.024 -.005l-.011 -.005l-.022 -.007l-.045 -.02l-.03 -.012l-.011 -.006l-.014 -.006l-.031 -.018l-.045 -.024l-.016 -.011l-.037 -.026l-.04 -.027l-.002 -.004l-.013 -.009l-.043 -.04l-.025 -.02l-.006 -.007l-.056 -.062l-.013 -.014l-.011 -.014l-.039 -.056l-.014 -.019l-.005 -.01l-.042 -.073l-.007 -.012l-.004 -.008l-.007 -.012l-.014 -.038l-.02 -.042l-.004 -.016l-.004 -.01l-.017 -.061l-.007 -.018l-.002 -.015l-.005 -.019l-.005 -.033l-.008 -.042l-.002 -.031l-.003 -.01v-.016l-.004 -.054l.001 -.036l.001 -.023l.002 -.053l.004 -.025v-.019l.008 -.035l.005 -.034l.005 -.02l.004 -.02l.018 -.06l.003 -.013l1.15 -3.45l-.022 -.037c-2.21 -3.747 -1.209 -8.391 2.413 -11.119z" />
                        </svg>
    </div> <span>Comment</span>
                            </div>
                            <div class="post-action">
                                <div class="emoji"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 8a3 3 0 1 0-2.83-4H9a3 3 0 1 0 0 2h6.17A3.001 3.001 0 0 0 18 8zM6 12a3 3 0 1 0 2.83 4H15a3 3 0 1 0 0-2H8.83A3.001 3.001 0 0 0 6 12z"/>
    </svg>
    </div> <span>Share</span>
                            </div>
                        </div>
                </div>
                `;
                container.appendChild(div);
            });
        }
    } catch (err) {
        console.error("Failed to load posts", err);
    }

}

//let the home button on click load posts
document.querySelectorAll('.home').forEach(homeBtn => {
    homeBtn.addEventListener('click', loadPosts);
})

//function to submit users post
const Postform = document.querySelector('.posts-form');

Postform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const postInput = document.querySelector('.post-input');
    const content = postInput.value.trim();

    if (!content) return;

    const postPayload = {
        content,
        imageUrl: null // or '' for empty string
    };

    try {
        const response = await fetch('http://localhost:3000/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(postPayload)
        });

        const data = await response.json();

        if (data.success) {
            postInput.value = '';
            loadPosts();
        } else {
            // console.error("Post failed:", data.error);
        }

    } catch (err) {
        // console.error("Request error:", err.message);
    }
});

function showOpenPost(closingELement, openingElement) {
    closingELement.classList.remove('active');
    openingElement.classList.add('active');
}
function openPost(id) {
    const closingElem = document.querySelector('#home');
    const openingElem = document.querySelector('#single-post');

    const postId = id;
    showOpenPost(closingElem, openingElem);
    singlePostRenderer(postId);
}

async function singlePostRenderer(postId) {
    const singlePost = document.querySelector('#single-post');
   
    const response = await fetch(`http://localhost:3000/post/${postId}`);
    const data = await response.json();

    if (!data.success) return;

    const { post, commentsData } = data;
    let { username, content, created_at, image_url } = post;
    singlePost.innerHTML = `
        <div class="single-post-section">
                    <div class="post-header-comment">
                        <div class="profile-image">${username.split(' ').map(w => w.charAt(0))}</div>
                        <div class="user-info">
                            <div class="username">${username}</div>
                            <div class="post-time">${new Date(created_at).toLocaleString()}</div>
                        </div>
                        <div class="comment-options">⋯</div>
                    </div>

                    <div class="post-content-comment">
                        <div class="post-text">
                           ${content}
                        </div>
                        ${image_url ? `<img src="${image_url}" alt="${image_url}" class="post-image"
                            onclick="openImageModal()">` : ''}
                    </div>

                    <div class="post-stats">
                        <div class="likes-count" onclick="showLikers()">
                            <span id="likesCount">127</span> likes
                        </div>
                        <div>
                            <span id="commentsCount">23</span> comments • <span id="sharesCount">8</span> shares
                        </div>
                    </div>

                    <div class="comment-actions">
                        <button class="action-btn" id="likeBtn" onclick="toggleLike()">
                            <span id="likeIcon">♡</span>
                            <span>Like</span>
                        </button>
                        <button class="action-btn" onclick="focusComment()">
                            <span>💬</span>
                            <span>Comment</span>
                        </button>
                        <button class="action-btn" id="shareBtn" onclick="openShareModal()">
                            <span>↗</span>
                            <span>Share</span>
                        </button>
                    </div>

                    <div class="comments-section">
                        <div class="comment-input-container">
                            <div class="comment-avatar">ME</div>
                            <div class="comment-input-wrapper">
                                <form class="comment-form">
                                    <textarea class="comment-input" id="commentInput" placeholder="Write a comment..."
                                        rows="1"></textarea>
                                    <button class="comment-submit" id="commentSubmit" disabled>→</button>
                                </form>
                            </div>
                        </div>
                        <div class="comments-list" id="commentsList">
                        </div>
                        </div>
                    </div>
                </div>

                <div class="share-modal" id="shareModal">
                    <div class="share-content">
                        <div class="share-title">Share this post</div>
                        <div class="share-options">
                            <div class="share-option" onclick="shareOption('facebook')">
                                <div class="share-icon">📘</div>
                                <div class="share-label">Facebook</div>
                            </div>
                            <div class="share-option" onclick="shareOption('twitter')">
                                <div class="share-icon">🐦</div>
                                <div class="share-label">Twitter</div>
                            </div>
                            <div class="share-option" onclick="shareOption('instagram')">
                                <div class="share-icon">📷</div>
                                <div class="share-label">Instagram</div>
                            </div>
                            <div class="share-option" onclick="shareOption('whatsapp')">
                                <div class="share-icon">💬</div>
                                <div class="share-label">WhatsApp</div>
                            </div>
                            <div class="share-option" onclick="shareOption('copy')">
                                <div class="share-icon">🔗</div>
                                <div class="share-label">Copy Link</div>
                            </div>
                            <div class="share-option" onclick="shareOption('email')">
                                <div class="share-icon">✉️</div>
                                <div class="share-label">Email</div>
                            </div>
                        </div>
                        <button class="close-share" onclick="closeShareModal()">Close</button>
                    </div>
                </div>`;
    submitPostComment(postId);
     const commentList = document.querySelector('#commentsList');    
    commentList.innerHTML = '';
    commentsData.forEach(c => {
        const { username, created_at, content } = c;
        const colors = ['#e74c3c, #f39c12', '#2ecc71, #3498db', '#9b59b6, #e67e22', '#34495e, #2c3e50'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const div = document.createElement('div');
        div.classList.add('comment');
        div.innerHTML =
            `<div class="comment-avatar"
                style="background: linear-gradient(45deg, ${randomColor}">${username.split(" ").map(word => word.charAt(0))}
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <div class="comment-username">${username}</div>
                    <div class="comment-time">${new Date(created_at).toLocaleString()}</div>
                </div>
                <div class="comment-text">${content}</div>
                <div class="comment-actions">
                    <span class="comment-action">Like</span>
                    <span class="comment-action">Reply</span>
                </div>
            </div>`;
        commentList.appendChild(div);
    });
}

//Allowing post comments

function submitPostComment(postId) {
    const input = document.querySelector('#commentInput');
    const submitBtn = document.querySelector('#commentSubmit');
    const commentForm = document.querySelector('.comment-form');
    input.addEventListener('input', () => {
        const text = input.value.trim();
        submitBtn.disabled = text ? false : true;
    });

    commentForm.addEventListener("submit", async (e) => {
        const text = input.value.trim();
        addComment('Me', text, 'now');
        e.preventDefault();
        const commentPayload = {
            content: input.value.trim(),
            postId: postId
        };
        input.value = '';

        try {
            const response = await fetch('http://localhost:3000/comment', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(commentPayload)
            });
            const data = await response.json();
            // console.log(data);
        } catch (err) {
            // console.log(err);
        }
    });
}

function addComment(username, text, time){
    const commentsList = document.getElementById('commentsList');
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['#e74c3c, #f39c12', '#2ecc71, #3498db', '#9b59b6, #e67e22', '#34495e, #2c3e50'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    comment.innerHTML = `
        <div class="comment-avatar" style="background: linear-gradient(45deg, ${randomColor});">${initials}</div>
        <div class="comment-content">
            <div class="comment-header">
                <div class="comment-username">${username}</div>
                <div class="comment-time">${time}</div>
            </div>
            <div class="comment-text">${text}</div>
            <div class="comment-actions">
                <span class="comment-action">Like</span>
                <span class="comment-action">Reply</span>
            </div>
        </div>
    `;
    
    commentsList.appendChild(comment);
}