/* KAGAMI GTA 5 RP — Main Script */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Burger menu ──
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  navbar.classList.toggle('menu-open');
});
document.querySelectorAll('.nav-links a, .btn-nav').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('menu-open'));
});

// ── Reveal on scroll ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero parallax ──
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

// ── Floating particles ──
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 35;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${Math.random() * 12 + 8}s;
    animation-delay: ${Math.random() * 10}s;
    opacity: ${Math.random() * 0.5 + 0.1};
  `;
  particlesContainer.appendChild(p);
}

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--purple-light)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => activeObserver.observe(section));
