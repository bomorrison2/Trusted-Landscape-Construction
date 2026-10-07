/* Gallery loader
   - assets/gallery/categories.json : the list of galleries (name, order, page, cover)
   - assets/gallery/gallery.json    : photos uploaded from the phone, per gallery
   Category pages get their heading and uploaded photos from these files.
   The homepage gallery tiles are rebuilt from categories.json.
   Both are edited from upload.html. */
(function () {
  function getJSON(path) {
    return fetch(path + '?v=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

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

  function pageFor(cat) {
    return cat.page || ('gallery.html?c=' + encodeURIComponent(cat.slug));
  }

  // ---------- homepage ----------
  function buildHomepage(homeGrid, cats, photos) {
    if (!cats || !cats.length) return;
    homeGrid.innerHTML = '';
    cats.forEach(function (cat) {
      var list = (photos && photos[cat.slug]) || [];
      var cover = list.length ? list[0].src : (cat.cover || 'assets/images/logo.png');
      var item = document.createElement('div');
      item.className = 'gallery-item';
      var a = document.createElement('a');
      a.href = pageFor(cat);
      var img = document.createElement('img');
      img.src = cover;
      img.alt = cat.label;
      img.loading = 'lazy';
      var p = document.createElement('p');
      p.textContent = cat.label;
      a.appendChild(img);
      a.appendChild(p);
      item.appendChild(a);
      homeGrid.appendChild(item);
    });
  }

  // ---------- category page ----------
  function buildCategoryPage(grid, cats, photos) {
    var slug = grid.getAttribute('data-category');
    if (!slug) {
      var m = location.search.match(/[?&]c=([^&]+)/);
      slug = m ? decodeURIComponent(m[1]) : '';
      grid.setAttribute('data-category', slug);
    }
    var cat = (cats || []).filter(function (c) { return c.slug === slug; })[0];
    if (cat) {
      var h2 = grid.parentNode.querySelector('h2');
      if (h2) h2.textContent = cat.label + ' Gallery';
      document.title = cat.label + ' Gallery - TLC Construction';
    }
    var list = (photos && photos[slug]) || [];
    var first = grid.firstElementChild; // newest uploads go first
    list.forEach(function (p) { addItem(grid, p, first); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.gallery-grid[data-category]');
    var homeGrid = document.querySelector('#gallery .gallery-grid');
    if (grid) {
      // Fix Windows-style backslash paths on older hard-coded images
      grid.querySelectorAll('img').forEach(function (img) {
        var raw = img.getAttribute('src');
        if (raw && raw.indexOf('\\') !== -1) img.setAttribute('src', raw.replace(/\\/g, '/'));
        wireLightbox(img);
      });
    }
    if (!grid && !homeGrid) return;
    Promise.all([getJSON('./assets/gallery/categories.json'), getJSON('./assets/gallery/gallery.json')])
      .then(function (res) {
        var cats = res[0], photos = res[1] || {};
        if (grid) buildCategoryPage(grid, cats, photos);
        else if (homeGrid) buildHomepage(homeGrid, cats, photos);
      });
  });
})();
