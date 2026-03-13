/* ===================================================
   KELVIN THAIRU — PORTFOLIO SCRIPT
   =================================================== */

// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .tech-card, .project-card, .repo-card, .blog-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

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


// ===== MATRIX CANVAS =====
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-={}[]|;:,.?/\\<>~`';
const fontSize = 13;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(9, 12, 16, 0.06)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff88';
  ctx.font = fontSize + 'px Fira Code, monospace';
  ctx.globalAlpha = 0.35;

  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
  ctx.globalAlpha = 1;
}

let matrixInterval = setInterval(drawMatrix, 60);

// Pause matrix when tab not visible to save resources
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(matrixInterval);
  } else {
    matrixInterval = setInterval(drawMatrix, 60);
  }
});


// ===== TYPED TEXT =====
const typedEl = document.getElementById('typed-text');
const words = ['code.', 'Web Development.', 'Python.', 'Cybersecurity.', 'Problem Solving.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function type() {
  const current = words[wordIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 400;
  }

  typingTimeout = setTimeout(type, delay);
}
type();


// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within a parent
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 5) * 0.08 + 's';
  revealObserver.observe(el);
});


// ===== SKILL BARS =====
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const target = fill.getAttribute('data-width');
      setTimeout(() => {
        fill.style.width = target + '%';
      }, 300);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.1 });

skillFills.forEach(fill => skillObserver.observe(fill));


// ===== CONTRIBUTION HEATMAP =====
function generateHeatmap() {
  const heatmap = document.getElementById('heatmap');
  if (!heatmap) return;

  const levels = [null, 'l1', 'l2', 'l3', 'l4'];
  const numWeeks = 52;

  for (let w = 0; w < numWeeks; w++) {
    const week = document.createElement('div');
    week.className = 'hm-week';

    for (let d = 0; d < 7; d++) {
      const day = document.createElement('div');
      day.className = 'hm-day';

      // Weighted random: more empty days for a realistic student pattern
      const rand = Math.random();
      let level = null;
      if (rand > 0.55) level = levels[1];
      if (rand > 0.72) level = levels[2];
      if (rand > 0.83) level = levels[3];
      if (rand > 0.92) level = levels[4];

      // Slightly more active in recent weeks
      if (w > 42) {
        const randBoost = Math.random();
        if (randBoost > 0.45) level = levels[1];
        if (randBoost > 0.65) level = levels[2];
        if (randBoost > 0.78) level = levels[3];
        if (randBoost > 0.90) level = levels[4];
      }

      if (level) day.classList.add(level);
      day.title = level ? `${w}w ${d}d — ${level.replace('l','Level ')} activity` : 'No contributions';
      week.appendChild(day);
    }
    heatmap.appendChild(week);
  }
}
generateHeatmap();


// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1400);
  });
}


// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));


// ===== RESUME DOWNLOAD PLACEHOLDER =====
document.getElementById('dl-resume')?.addEventListener('click', (e) => {
  e.preventDefault();
  // Replace this with actual resume URL
  const toast = document.createElement('div');
  toast.textContent = '📄 Resume coming soon!';
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    background: 'rgba(0,255,136,0.1)',
    border: '1px solid rgba(0,255,136,0.3)',
    color: 'var(--accent)',
    padding: '0.8rem 1.4rem',
    borderRadius: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    zIndex: '9999',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.3s ease',
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
});


// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
  }
});


// ===== PROJECT CARD TILT EFFECT =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ===== GLITCH EFFECT ON NAME =====
function startGlitch() {
  const nameEl = document.querySelector('.name-highlight');
  if (!nameEl) return;

  const originalText = 'Kelvin Thairu';
  const glitchChars = '!<>-_\\/[]{}—=+*^?#@%&~';
  let iterations = 0;
  const maxIterations = 12;

  const interval = setInterval(() => {
    nameEl.textContent = originalText.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (i < iterations) return originalText[i];
      return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }).join('');

    iterations += 0.4;
    if (iterations >= originalText.length) {
      clearInterval(interval);
      nameEl.textContent = originalText;
    }
  }, 40);
}

// Trigger glitch on hover
document.querySelector('.hero-name')?.addEventListener('mouseenter', startGlitch);

// Trigger on load
setTimeout(startGlitch, 800);


// ===== COUNTER ANIMATION FOR STATS =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = el.textContent;
    if (target === '∞') return;
    const num = parseInt(target);
    if (isNaN(num)) return;

    let current = 0;
    const step = Math.ceil(num / 25);
    const timer = setInterval(() => {
      current += step;
      if (current >= num) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current + '+';
      }
    }, 50);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);
