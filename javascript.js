// Contact form: submitted to Netlify Forms, which emails each enquiry on
var contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var btn = contactForm.querySelector('button[type=submit]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    document.getElementById('errorMessage').style.display = 'none';
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
    })
    .then(function (response) {
        if (!response.ok) throw new Error('Form error ' + response.status);
        contactForm.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    })
    .catch(function (error) {
        console.error(error);
        document.getElementById('errorMessage').style.display = 'block';
        if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
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

