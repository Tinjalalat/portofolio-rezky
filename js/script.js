// ===== Loading Screen =====
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.loader').classList.add('hidden'), 2200);
});

// ===== Scroll Progress Bar =====
const progressBar = document.querySelector('.scroll-progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
});

// ===== Custom Cursor =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && cursorRing) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx - 3 + 'px';
    cursorDot.style.top = my - 3 + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cursorRing.style.left = rx - 20 + 'px';
    cursorRing.style.top = ry - 20 + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .hoverable').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.transform = 'scale(1.8)';
      cursorRing.style.borderColor = 'rgba(249,115,22,0.7)';
      cursorRing.style.background = 'rgba(249,115,22,0.04)';
      cursorDot.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.transform = 'scale(1)';
      cursorRing.style.borderColor = 'rgba(249,115,22,0.3)';
      cursorRing.style.background = 'transparent';
      cursorDot.style.transform = 'scale(1)';
    });
  });
}

// ===== Particles =====
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [], w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w; this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.color = ['249,115,22', '236,72,153', '139,92,246'][Math.floor(Math.random() * 3)];
    }
    update() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.color},${this.opacity})`; ctx.fill(); }
  }

  const count = Math.min(70, Math.floor(w * h / 18000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249,115,22,${0.04 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  })();
}

// ===== Navbar =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});
navItems.forEach(a => a.addEventListener('click', () => {
  navToggle.classList.remove('active'); navLinks.classList.remove('active'); document.body.style.overflow = '';
}));

// ===== Active Nav =====
const sections = document.querySelectorAll('.section, .hero');
function updateNav() {
  const pos = window.scrollY + 120;
  sections.forEach(s => {
    const id = s.getAttribute('id');
    if (id && pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight)
      navItems.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === `#${id}`); });
  });
}
window.addEventListener('scroll', updateNav);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Staggered Reveal =====
const reveals = document.querySelectorAll('.reveal-stagger');
function handleReveal() {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const delay = parseFloat(el.dataset.delay || 0);
    if (top < window.innerHeight - 80) {
      setTimeout(() => el.classList.add('visible'), delay * 1000);
    }
  });
}
window.addEventListener('scroll', handleReveal);
window.addEventListener('load', () => setTimeout(handleReveal, 2400));

// ===== Typing Effect =====
class TypeWriter {
  constructor(el, words, wait = 2500) {
    this.el = el; this.words = words; this.wait = parseInt(wait);
    this.i = 0; this.txt = ''; this.del = false; this.type();
  }
  type() {
    const full = this.words[this.i % this.words.length];
    this.txt = this.del ? full.substring(0, this.txt.length - 1) : full.substring(0, this.txt.length + 1);
    this.el.innerHTML = `<span class="typed-text">${this.txt}</span><span class="cursor">|</span>`;
    let speed = this.del ? 40 : 80;
    if (!this.del && this.txt === full) { speed = this.wait; this.del = true; }
    else if (this.del && this.txt === '') { this.del = false; this.i++; speed = 500; }
    setTimeout(() => this.type(), speed);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.typed-output');
  if (el) new TypeWriter(el, JSON.parse(el.dataset.words), el.dataset.wait);
});

// ===== Counter Animation =====
function animateCount(el, target, dur = 2000) {
  let s = 0; const inc = target / (dur / 16);
  (function go() { s += inc; if (s < target) { el.textContent = Math.ceil(s); requestAnimationFrame(go); } else el.textContent = target; })();
}
const statNums = document.querySelectorAll('.stat-num');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { const c = parseInt(e.target.dataset.count); if (c) animateCount(e.target, c); cObs.unobserve(e.target); } });
}, { threshold: 0.5 });
statNums.forEach(s => cObs.observe(s));

// ===== 3D Tilt =====
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rX = (y - r.height / 2) / r.height * -6;
    const rY = (x - r.width / 2) / r.width * 6;
    card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== Card Mouse Glow Effect =====
document.querySelectorAll('.card-glow-effect').forEach(glow => {
  const parent = glow.parentElement;
  parent.addEventListener('mousemove', e => {
    const r = parent.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    glow.style.opacity = '1';
    glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(249,115,22,0.08), transparent 60%)`;
  });
  parent.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
});

// ===== Back to Top =====
const btt = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => { btt.classList.toggle('visible', window.scrollY > 500); });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== GPA Ring on Scroll =====
const gpaCircle = document.querySelector('.gpa-circle');
if (gpaCircle) {
  const gObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { gpaCircle.style.animation = 'gpaFill 2s ease-out forwards'; gObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  gObs.observe(gpaCircle);
}

// ===== Form =====
const form = document.querySelector('.contact-form-modern');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const subject = encodeURIComponent(`Portfolio Contact from ${fd.get('name')}`);
    const body = encodeURIComponent(`Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\nMessage:\n${fd.get('message')}`);
    window.location.href = `mailto:m.rezky515@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
}

// ===== Magnetic Button Effect =====
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0) scale(1)';
  });
});

// ===== Works Gallery Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        item.style.position = ''; item.style.width = ''; item.style.height = '';
        item.style.margin = ''; item.style.padding = ''; item.style.overflow = '';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== Lightbox Modal (Lihat Ukuran Asli) =====
const lightbox = document.getElementById('lightboxModal');
if (lightbox) {
  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbTitle = lightbox.querySelector('.lightbox-title');
  const lbTools = lightbox.querySelector('.lightbox-tools');
  const lbDims = lightbox.querySelector('.lightbox-dimensions');
  const lbDl = lightbox.querySelector('.lightbox-download-btn');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbBackdrop = lightbox.querySelector('.lightbox-backdrop');

  function openLightbox(src, title, tools, alt) {
    lbImg.src = src;
    lbImg.alt = alt || title || 'Artwork';
    lbTitle.textContent = title || 'Artwork';
    lbTools.textContent = tools || '';
    if (lbDl) lbDl.href = src;
    if (lbDims) lbDims.textContent = 'Memuat dimensi...';

    lbImg.onload = () => {
      if (lbDims && lbImg.naturalWidth) {
        lbDims.textContent = `${lbImg.naturalWidth} × ${lbImg.naturalHeight} px (Asli)`;
      }
    };

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    document.body.style.overflow = '';
  }

  // Event listener untuk setiap gambar di work items
  document.querySelectorAll('.work-item').forEach(item => {
    const img = item.querySelector('.work-image img');
    if (img) {
      const trigger = item.querySelector('.work-image');
      trigger.style.cursor = 'zoom-in';
      trigger.addEventListener('click', (e) => {
        const title = item.querySelector('.work-overlay h4')?.textContent || '';
        const tools = item.querySelector('.work-overlay p')?.textContent || '';
        openLightbox(img.getAttribute('src'), title, tools, img.getAttribute('alt'));
      });
    }
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

console.log('%c🔥 Portfolio V3 Loaded!', 'color:#f97316; font-size:16px; font-weight:bold;');

