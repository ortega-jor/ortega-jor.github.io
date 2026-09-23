/* Jorge Ortega portfolio - shared behaviour.
   Loaded by index.html and every page under /projects/. Each block is a no-op
   on pages that do not contain the elements it looks for. */

/* ---------- Theme toggle ---------- */
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var KEY = 'jorge_theme_pref';

  function apply(mode) {
    root.classList.toggle('light-theme', mode === 'light');
    if (toggle) {
      toggle.innerHTML = mode === 'light' ? '&#9728;' : '&#9680;';
      toggle.setAttribute('aria-pressed', String(mode === 'light'));
    }
  }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  var prefersLight = window.matchMedia &&
                     window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(stored === 'light' || stored === 'dark' ? stored : (prefersLight ? 'light' : 'dark'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.classList.contains('light-theme') ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    });
  }
})();

/* ---------- Lightbox for gallery images ----------
   By default a thumbnail opens enlarged on its own. Optional attributes:
     data-lightbox     show this image instead of the thumbnail itself
     data-after        show a second image alongside, as a labelled pair
     data-before-label / data-after-label   captions for the two panes
     data-lightbox-alt / data-after-alt     alt text for each pane */
(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;
  var inner = box.querySelector('.lb-inner');
  if (!inner) return;

  // Work out which images a thumbnail should open, and how to label them.
  function itemsFor(t) {
    var d = t.dataset;
    if (d.set) {
      var labels = (d.setLabels || '').split('|');
      return d.set.split('|').map(function (src, i) {
        var label = (labels[i] || '').trim();
        return { src: src.trim(), label: label, alt: label };
      });
    }
    var main = { src: d.lightbox || t.currentSrc || t.src, alt: d.lightboxAlt || t.alt };
    if (!d.after) return [main];
    main.label = d.beforeLabel || 'Before';
    return [main, { src: d.after, alt: d.afterAlt, label: d.afterLabel || 'After' }];
  }

  function close() {
    box.classList.remove('active');
    inner.innerHTML = '';
  }

  document.querySelectorAll('.gallery img').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var items = itemsFor(thumb);
      inner.innerHTML = '';
      items.forEach(function (it) {
        var fig = document.createElement('figure');
        var img = document.createElement('img');
        img.src = it.src;
        img.alt = it.alt || '';
        var cap = document.createElement('figcaption');
        cap.textContent = it.label || '';
        fig.appendChild(img);
        fig.appendChild(cap);
        inner.appendChild(fig);
      });
      // 1 across for a single image, 3 across for exactly three, otherwise 2
      var cols = items.length === 1 ? 1 : (items.length === 3 ? 3 : 2);
      inner.style.gridTemplateColumns = 'repeat(' + cols + ',minmax(0,1fr))';
      box.classList.toggle('multi', items.length > 1);
      box.classList.toggle('rows', Math.ceil(items.length / cols) > 1);
      box.classList.add('active');
    });
  });

  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('active')) close();
  });
})();

/* ---------- Video modal ---------- */
(function () {
  var modal = document.getElementById('videoModal');
  if (!modal) return;
  var video = modal.querySelector('video');
  var media = modal.querySelector('.vm-media');
  var image = modal.querySelector('.vm-media img');
  var title = modal.querySelector('.vm-text h3');
  var body = modal.querySelector('.vm-text p');
  var closeBtn = modal.querySelector('.vm-close');

  function close() {
    modal.classList.remove('active');
    video.pause();
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-gallery figure, .gallery figure.vid').forEach(function (fig) {
    fig.addEventListener('click', function () {
      video.src = fig.dataset.video;
      video.load();
      title.textContent = fig.dataset.title || '';
      body.textContent = fig.dataset.description || '';

      var extra = fig.dataset.image;
      if (extra) {
        image.src = extra;
        image.hidden = false;
        media.classList.add('has-image');
      } else {
        image.hidden = true;
        image.removeAttribute('src');
        media.classList.remove('has-image');
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
})();
