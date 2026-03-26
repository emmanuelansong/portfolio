/* ── CUSTOM CURSOR ─────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * .12;       ry += (my - ry) * .12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button, .project-card, .contact-link-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── NAV SCROLL ────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── PARTICLE BACKGROUND ───────────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.2 + .3;
    this.vx = (Math.random() - .5) * .18;
    this.vy = (Math.random() - .5) * .18;
    this.a  = Math.random() * .6 + .1;
    this.color = Math.random() > .2 ? '#ff4d6d' : '#00ffe1';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.a;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00ffe1';
        ctx.globalAlpha = (1 - d/90) * .08;
        ctx.lineWidth = .5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(loop);
}
loop();

/* ── INTERSECTION OBSERVER (reveal + timeline) ─────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));

/* ── STAGGER project cards ─────────────────────────────── */
document.querySelectorAll('.project-card.reveal').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

/* ── TYPEWRITER effect on hero tag ────────────────────── */
const tag = document.querySelector('.hero-tag');
const original = tag.textContent;
tag.textContent = '';
let ti = 0;
function typeIt() {
  if (ti <= original.length) {
    tag.textContent = original.slice(0, ti++);
    setTimeout(typeIt, 38);
  }
}
setTimeout(typeIt, 600);
