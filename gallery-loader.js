/* Loads photos uploaded from the phone (assets/gallery/gallery.json) into the
   gallery grid on each category page, and adds a tap-to-enlarge lightbox. */
(function () {
  function ensureLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.className = 'lightbox';
      lb.innerHTML = '<span class="close">&times;</span><img class="lightbox-content" id="lightbox-img" alt="">';
      document.body.appendChild(lb);
    }
    lb.onclick = function () { lb.style.display = 'none'; };
    return lb;
  }

  function wireLightbox(img) {
    img.style.cursor = 'zoom-in';
    img.onclick = function () {
      var lb = ensureLightbox();
      document.getElementById('lightbox-img').src = img.src;
      lb.style.display = 'block';
    };
  }

  function addItem(grid, photo, before) {
    var div = document.createElement('div');
    div.className = 'gallery-item';
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption || 'Project photo';
    img.loading = 'lazy';
    div.appendChild(img);
    if (photo.caption) {
      var p = document.createElement('p');
      p.textContent = photo.caption;
      div.appendChild(p);
    }
    grid.insertBefore(div, before || null);
    wireLightbox(img);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.gallery-grid[data-category]');
    if (!grid) return;
    // Fix Windows-style backslash paths on older hard-coded images
    grid.querySelectorAll('img').forEach(function (img) {
      var raw = img.getAttribute('src');
      if (raw && raw.indexOf('\\') !== -1) img.setAttribute('src', raw.replace(/\\/g, '/'));
      wireLightbox(img);
    });
    var cat = grid.getAttribute('data-category');
    fetch('./assets/gallery/gallery.json?v=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (data) {
        var photos = (data && data[cat]) || [];
        var first = grid.firstElementChild; // newest uploads go first
        photos.forEach(function (p) { addItem(grid, p, first); });
      })
      .catch(function () {});
  });
})();
