let isLiked = false;
let likesCount = 127;
let commentsCount = 23;
let sharesCount = 8;

function toggleLike() {
    const likeBtn = document.getElementById('likeBtn');
    const likeIcon = document.getElementById('likeIcon');
    const likesCountEl = document.getElementById('likesCount');
    
    if (isLiked) {
        isLiked = false;
        likesCount--;
        likeIcon.textContent = '♡';
        likeBtn.classList.remove('liked');
    } else {
        isLiked = true;
        likesCount++;
        likeIcon.textContent = '❤️';
        likeBtn.classList.add('liked');
        
        // Create floating heart animation
        createFloatingHeart(likeBtn);
        
        // Pulse animation
        likeBtn.classList.add('pulse');
        setTimeout(() => likeBtn.classList.remove('pulse'), 300);
    }
    
    likesCountEl.textContent = likesCount;
}

function createFloatingHeart(element) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤️';
    
    const rect = element.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 1000);
}

function focusComment() {
    document.getElementById('commentInput').focus();
}

function postComment() {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    
    if (text) {
        addComment('Me', text, 'now');
        input.value = '';
        updateCommentSubmitButton();
        commentsCount++;
        document.getElementById('commentsCount').textContent = commentsCount;
    }
}

function addComment(username, text, time) {
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

function updateCommentSubmitButton() {
    const input = document.getElementById('commentInput');
    const submit = document.getElementById('commentSubmit');
    
    submit.disabled = !input.value.trim();
}

function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareOption(platform) {
    const shareBtn = document.getElementById('shareBtn');
    
    switch(platform) {
        case 'copy':
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out this amazing post!`);
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent('Check out this post: ' + window.location.href)}`);
            break;
        case 'email':
            window.location.href = `mailto:?subject=Check out this post&body=${encodeURIComponent(window.location.href)}`;
            break;
        default:
            alert(`Shared on ${platform}!`);
    }
    
    if (platform !== 'copy') {
        sharesCount++;
        document.getElementById('sharesCount').textContent = sharesCount;
        shareBtn.classList.add('shared');
        setTimeout(() => shareBtn.classList.remove('shared'), 2000);
    }
    
    closeShareModal();
}

function showLikers() {
    alert('127 people liked this post:\nJessica Smith, Mike Johnson, Sarah Wilson, and 124 others');
}

// function openImageModal() {
//     // You could implement a full-screen image modal here
//     alert('Image modal would open here');
// }

// Event listeners
document.getElementById('commentInput').addEventListener('input', function() {
    updateCommentSubmitButton();
    
    // Auto-resize textarea
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

document.getElementById('commentInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        postComment();
    }
});

// Close share modal when clicking outside
document.getElementById('shareModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeShareModal();
    }
});

// Initialize
updateCommentSubmitButton();
