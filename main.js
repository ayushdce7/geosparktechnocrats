/* ============================================
   GeoSpark Technocrats - Main JavaScript
   ============================================ */

'use strict';

// ============ Loader ============
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

// ============ Custom Cursor ============
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .service-card, .industry-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '60px';
      cursorRing.style.height = '60px';
      cursorRing.style.borderColor = 'rgba(247,148,29,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.borderColor = 'rgba(15,76,129,0.4)';
    });
  });
}

// ============ Scroll Progress Bar ============
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (progressBar) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    progressBar.style.width = pct + '%';
  }
}, { passive: true });

// ============ Sticky Navbar ============
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
}, { passive: true });

// ============ Smooth Scroll ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile nav
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  });
});

// ============ Active Nav Link (Scroll Spy) ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

// ============ Back to Top ============
const backTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ Mouse Glow ============
const mouseGlow = document.querySelector('.mouse-glow');
if (mouseGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ============ Hero Typing Effect ============
const typedEl = document.getElementById('typed-text');
if (typedEl) {
  const words = ['Infrastructure', 'Sustainability', 'Excellence', 'Innovation'];
  let wi = 0, ci = 0, deleting = false;

  function typeWord() {
    const word = words[wi];
    if (!deleting) {
      typedEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        setTimeout(() => { deleting = true; typeWord(); }, 2000);
        return;
      }
    } else {
      typedEl.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(typeWord, deleting ? 60 : 100);
  }
  typeWord();
}

// ============ Particle Canvas Hero ============
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -Math.random() * 0.8 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(28,181,224,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ============ Hero Blob Colors ============
const blobs = document.querySelectorAll('.hero-blob');
if (blobs.length) {
  // Already animated via CSS
}

// ============ Project Filter ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      if (show) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.display = 'block';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
            card.style.display = 'none';
          }
        }, 400);
      }
    });
  });
});

// ============ Testimonials Slider ============
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.slider-dot');

function showSlide(idx) {
  slides.forEach((s, i) => {
    s.style.display = i === idx ? 'block' : 'none';
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  currentSlide = idx;
}

if (slides.length > 0) {
  showSlide(0);
  setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });
}

// ============ Form Validation ============
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('[name="name"]').value.trim();
    const email = this.querySelector('[name="email"]').value.trim();
    const message = this.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const btn = this.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      this.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1500);
  });
}

function showToast(msg, type) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    background:${type === 'success' ? '#28a745' : '#dc3545'};
    color:#fff; padding:1rem 2rem; border-radius:50px;
    font-weight:600; z-index:9999; font-size:0.9rem;
    box-shadow:0 8px 30px rgba(0,0,0,0.2);
    animation: slideUp 0.4s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ============ Dark Mode Toggle ============
const darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }

  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    localStorage.setItem('darkMode', isDark);
  });
}

// ============ Image Tilt Effect ============
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

// ============ Magnetic Buttons ============
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn-primary-custom, .btn-outline-custom').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s ease';
    });
  });
}

// ============ Button Ripple ============
document.querySelectorAll('.btn-primary-custom').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:0; height:0;
      background:rgba(255,255,255,0.35);
      left:${e.clientX - rect.left}px; top:${e.clientY - rect.top}px;
      transform:translate(-50%,-50%);
      animation:rippleAnim 0.6s ease out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple animation style
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { width:200px; height:200px; opacity:0; }
  }
  @keyframes slideUp {
    from { transform:translateX(-50%) translateY(20px); opacity:0; }
    to { transform:translateX(-50%) translateY(0); opacity:1; }
  }
  .slider-dot {
    width:10px; height:10px; background:rgba(255,255,255,0.3);
    border-radius:50%; display:inline-block; margin:0 4px; cursor:pointer; transition:all 0.3s;
  }
  .slider-dot.active { background:#fff; transform:scale(1.3); }
`;
document.head.appendChild(style);

// ============ Intersection Observer Animations ============
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
  animObserver.observe(el);
});

// ============ Lazy Loading Images ============
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported
} else {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}
