const fileContainer = document.querySelector('.inputed-files');
const fileSecondContainer = document.querySelector('.inputed-file');
const postsOptions = document.querySelectorAll('.post-option');
postsOptions.forEach(options => {
    options.addEventListener("click", function(){
        const fileType = this.dataset.file;
        document.getElementById(`${fileType}`).click();
    })
})

//Read the file and make it addable to the ui
function handlePostFileSelect(event){
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

//Create a div to contain the selected image on the ui
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
        const img = e.target.closest('.image-post');// this gets the closest parent to the element, thats if i didn't pass any thing in the ()
        img.remove(); // the remove function removes the element;
    }
});

//Creates a div to contain the selected file on the ui
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
//This gets the file size so it can be shown in the ui. for files only.
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}