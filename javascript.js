document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    var formData = new FormData(event.target);

    fetch(event.target.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // This is to prevent CORS errors if you're using services like Formspree
    })
    .then(response => {
        // Here you can check the server response
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    })
    .catch(error => {
        // Handle errors if any
        console.error('Error:', error);
    });
});
function openLightbox(imgSrc) {
    document.getElementById('lightbox').style.display = "block";
    document.getElementById('lightbox-img').src = imgSrc;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
}

// Add event listeners to gallery images
document.querySelectorAll('.fencing-page .gallery-item img').forEach(img => {
    img.onclick = () => openLightbox(img.src);
});

