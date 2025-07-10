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
                div.innerHTML = `
                    <div class="post">
                    <div class="posts-container">
                        <div class="avatar">JS</div>
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
                            <div class="emoji-liked">👍</div> <span>Upvote</span>
                        </div>
                        <div class="post-action" data-comment="false">
                            <div class="emoji">💬</div> <span>Comment</span>
                        </div>
                        <div class="post-action">
                            <div class="emoji">📤</div> <span>Share</span>
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

//function to submit users post
const Postform = document.querySelector('.posts-form');

Postform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const postInput = document.querySelector('.post-input');
    const content = postInput.value.trim();

    if (!content) return;

    const postPayload = {
        content,
        imageUrl: null // or '' if you prefer empty string
    };

    try {
        const response = await fetch('http://localhost:3000/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(postPayload)
        });

        const data = await response.json();

        if (data.success) {
            postInput.value = '';
            // console.log("Post submitted");
            loadPosts();
        } else {
            // console.error("Post failed:", data.error);
        }

    } catch (err) {
        // console.error("Request error:", err.message);
    }
});

