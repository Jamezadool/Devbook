const fileContainer = document.querySelector('.inputed-files');
const fileSecondContainer = document.querySelector('.inputed-file');
const postsOptions = document.querySelectorAll('.post-option');
postsOptions.forEach(options => {
    options.addEventListener("click", function(){
        const fileType = this.dataset.file;
        document.getElementById(`${fileType}`).click();
    })
})

function handleFileSelect(event){
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(e){
        if(file.type.startsWith('image/')){
            addImageToPost(e.target.result, file.name);
        }else{
            addFileToPost(file.name, formatFileSize(file.size));
        }
    }
    reader.readAsDataURL(file);
    fileContainer.classList.add('active');
}

function addImageToPost(src, name){
    const div = document.createElement('div');
    div.className = "image-post"
    div.innerHTML = `<div class="files">
                            <button class="delbtn">X</button>
                            <img src="${src}" alt="${name}" class="file">
                        </div>`
    fileSecondContainer.appendChild(div);
}  

fileSecondContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains('delbtn')){
        const img = e.target.closest('.image-post');
        img.remove();
    }
})

function addFileToPost(name, size){
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function deleteFile(){
    // const fileToBeDeleted = this.dataset.index; an error doesnt work
    //find a way to get the deletebtn to delete the element. maybe we have to create an array where the images/file stay then loop through it then have it removeable. hehe... like the one you did in the e-commerce site;    
}