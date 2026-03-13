/* ===================================================
   KELVIN THAIRU — PAGES SCRIPT
   Shared JS for blog.html, resume.html, hire.html
   =================================================== */

// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .service-card, .article-card, .why-card, .resume-project').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  // Trigger on load in case page is already scrolled
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
    revealObserver.observe(el);
  });
}

// ===== SKILL BARS (resume page) =====
const skillFills = document.querySelectorAll('.skill-fill');
if (skillFills.length) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = target + '%'; }, 300);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });
  skillFills.forEach(f => skillObserver.observe(f));
}

// ===== BLOG SEARCH & FILTER =====
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const articlesGrid = document.getElementById('articles-grid');
const noResults = document.getElementById('no-results');
const articleCountEl = document.getElementById('article-count');
const filterChips = document.querySelectorAll('.filter-chip');

let activeFilter = 'all';
let searchQuery = '';

function filterArticles() {
  if (!articlesGrid) return;
  const articles = articlesGrid.querySelectorAll('.article-card');
  let visible = 0;

  articles.forEach(card => {
    const category = card.getAttribute('data-category');
    const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    const text = title + ' ' + desc;

    const matchesFilter = activeFilter === 'all' || category === activeFilter;
    const matchesSearch = searchQuery === '' || text.includes(searchQuery);

    if (matchesFilter && matchesSearch) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  if (articleCountEl) articleCountEl.textContent = visible;
  if (noResults) noResults.classList.toggle('visible', visible === 0);
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    if (searchClear) searchClear.classList.toggle('visible', searchQuery.length > 0);
    filterArticles();
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.remove('visible');
    filterArticles();
    searchInput.focus();
  });
}

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.getAttribute('data-filter');
    filterArticles();
  });
});

// ===== RESUME DOWNLOAD PLACEHOLDER =====
const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('📄 PDF resume coming soon! Use the print button in your browser to save this page.');
  });
}

// ===== TOAST UTILITY =====
function showToast(message) {
  // Remove existing toasts
  document.querySelectorAll('.kt-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'kt-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    background: 'rgba(13,17,23,0.95)',
    border: '1px solid rgba(0,255,136,0.3)',
    color: '#e2e8f0',
    padding: '1rem 1.4rem',
    borderRadius: '10px',
    fontFamily: '"Fira Code", monospace',
    fontSize: '0.78rem',
    zIndex: '9999',
    backdropFilter: 'blur(20px)',
    maxWidth: '340px',
    lineHeight: '1.6',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    opacity: '0',
    transform: 'translateY(10px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ===== HIRE PAGE — service card tilt =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
