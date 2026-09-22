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

/* ---------- Lightbox for gallery images ---------- */
(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;
  var img = box.querySelector('img');

  function close() { box.classList.remove('active'); img.src = ''; }

  document.querySelectorAll('.gallery img').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      img.src = thumb.currentSrc || thumb.src;
      img.alt = thumb.alt || '';
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

  document.querySelectorAll('.video-gallery figure').forEach(function (fig) {
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
