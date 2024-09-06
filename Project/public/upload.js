document.getElementById('b').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.click();

    input.onchange = function(event) {
        const files = event.target.files;
        const galleryDiv = document.querySelector('.image-gallery');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                galleryDiv.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    };
});
