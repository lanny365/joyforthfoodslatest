// ===== UNDER CONSTRUCTION GATE =====
(function() {
  const isAdmin      = sessionStorage.getItem('jf_admin') === 'true';
  const isUnderConst = localStorage.getItem('jf_construction') === 'true';
  const overlay      = document.getElementById('uc-overlay');
  const banner       = document.getElementById('uc-banner');

  if (isUnderConst) {
    if (isAdmin) {
      // Admin sees site + warning banner
      if (overlay) overlay.style.display = 'none';
      if (banner)  banner.style.display  = 'flex';
    } else {
      // Visitors see full overlay
      if (overlay) overlay.style.display = 'flex';
      if (banner)  banner.style.display  = 'none';
    }
  } else {
    // Construction mode off — everyone sees site
    if (overlay) overlay.style.display = 'none';
    if (banner)  banner.style.display  = 'none';
  }
})();

// ===== HERO SLIDESHOW =====
const heroSlides = [
  {
    badge:   '🥜 100% NATURAL · NO PRESERVATIVES',
    heading: 'The Finest<br /><span class="highlight">Premium</span><br />Peanuts',
    desc:    'Enjoy the rich taste and crunchy goodness of JoyForth Peanuts. Carefully selected and processed to deliver freshness, quality, and nutrition in every bite.',
    img:     'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=500&q=80',
    alt:     'Premium Peanuts'
  },
  {
    badge:   '🍌 CRISPY · GOLDEN · IRRESISTIBLE',
    heading: 'The Crunchiest<br /><span class="highlight">Premium</span><br />Plantain Chips',
    desc:    'Made from premium plantains and expertly prepared for the perfect crunch, JoyForth Plantain Chips offer a delicious and healthy snacking experience. Available in exciting flavors, they are the ideal choice for lovers of authentic African snacks.',
    img:     'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=500&q=80',
    alt:     'Premium Plantain Chips'
  },
  {
    badge:   '🍎 NATURALLY DRIED · NUTRIENT RICH',
    heading: 'Naturally Dried<br /><span class="highlight">Premium</span><br />Fruit Snacks',
    desc:    'Experience nature\'s sweetness with JoyForth Dehydrated Fruits. Produced from carefully selected fresh fruits and naturally preserved to retain their flavor and nutrients, they provide a healthy, tasty, and convenient snack for people of all ages.',
    img:     'https://images.unsplash.com/photo-1604148056278-7e3b3f83ebde?w=500&q=80',
    alt:     'Dehydrated Fruit Snacks'
  }
];

let currentSlide = 0;
// Set initial background
window.addEventListener('DOMContentLoaded', () => {
  const bg = document.getElementById('hero-bg');
  if (bg) bg.style.backgroundImage = `url('${heroSlides[0].img}')`;
});

function goToSlide(index) {
  currentSlide = index;
  const slide = heroSlides[index];

  const heading = document.getElementById('hero-heading');
  const desc    = document.getElementById('hero-desc');
  const badge   = document.getElementById('hero-badge');
  const bg      = document.getElementById('hero-bg');
  const dots    = document.querySelectorAll('.dot');

  heading.classList.remove('hero-fade');
  desc.classList.remove('hero-fade');
  void heading.offsetWidth;

  heading.innerHTML = slide.heading;
  desc.textContent  = slide.desc;
  badge.textContent = slide.badge;

  // Crossfade background
  if (bg) {
    bg.style.opacity = '0';
    setTimeout(() => {
      bg.style.backgroundImage = `url('${slide.img}')`;
      bg.style.opacity = '1';
    }, 400);
  }

  heading.classList.add('hero-fade');
  desc.classList.add('hero-fade');
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

// Dot click
document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideTimer);
    goToSlide(Number(dot.dataset.index));
    slideTimer = setInterval(nextSlide, 60000);
  });
});

function nextSlide() {
  goToSlide((currentSlide + 1) % heroSlides.length);
}

let slideTimer = setInterval(nextSlide, 60000);

// ===== LOAD ADMIN-UPLOADED IMAGES =====
function applyAdminImages() {
  const maps = [
    { key: 'hero-0', el: null },   // handled in slideshow
    { key: 'hero-1', el: null },
    { key: 'hero-2', el: null },
    { key: 'cat-0',  selector: '.varieties-grid .variety-card:nth-child(1) img' },
    { key: 'cat-1',  selector: '.varieties-grid .variety-card:nth-child(2) img' },
    { key: 'cat-2',  selector: '.varieties-grid .variety-card:nth-child(3) img' },
    { key: 'story-main', selector: '.story-img-main' },
    { key: 'prod-0', selector: '#products-grid .product-card:nth-child(1) img' },
    { key: 'prod-1', selector: '#products-grid .product-card:nth-child(2) img' },
    { key: 'prod-2', selector: '#products-grid .product-card:nth-child(3) img' },
    { key: 'prod-3', selector: '#products-grid .product-card:nth-child(4) img' },
    { key: 'prod-4', selector: '#products-grid .product-card:nth-child(5) img' },
    { key: 'prod-5', selector: '#products-grid .product-card:nth-child(6) img' },
    { key: 'prod-6', selector: '#products-grid .product-card:nth-child(7) img' },
    { key: 'prod-7', selector: '#products-grid .product-card:nth-child(8) img' },
  ];
  maps.forEach(({ key, selector }) => {
    const saved = localStorage.getItem('jf_img_' + key);
    if (saved && selector) {
      const el = document.querySelector(selector);
      if (el) el.src = saved;
    }
  });
  // Override hero slide images with admin uploads
  ['hero-0','hero-1','hero-2'].forEach((key, i) => {
    const saved = localStorage.getItem('jf_img_' + key);
    if (saved) heroSlides[i].img = saved;
  });
}
applyAdminImages();

// ===== APPLY ADMIN TEXT =====
function applyAdminText() {
  const get = key => localStorage.getItem('jf_txt_' + key);

  // Hero slides
  const h0 = get('txt-hero0-heading'); if (h0) heroSlides[0].heading = h0 + '<br />';
  const d0 = get('txt-hero0-desc');    if (d0) heroSlides[0].desc    = d0;
  const h1 = get('txt-hero1-heading'); if (h1) heroSlides[1].heading = h1 + '<br />';
  const d1 = get('txt-hero1-desc');    if (d1) heroSlides[1].desc    = d1;
  const h2 = get('txt-hero2-heading'); if (h2) heroSlides[2].heading = h2 + '<br />';
  const d2 = get('txt-hero2-desc');    if (d2) heroSlides[2].desc    = d2;

  // Story
  const sh = get('txt-story-heading');
  if (sh) { const el = document.querySelector('.story-text h2'); if (el) el.textContent = sh; }
  const sp1 = get('txt-story-p1');
  if (sp1) { const el = document.querySelector('.story-text p:nth-of-type(1)'); if (el) el.textContent = sp1; }
  const sp2 = get('txt-story-p2');
  if (sp2) { const el = document.querySelector('.story-text p:nth-of-type(2)'); if (el) el.textContent = sp2; }

  // Contact
  const wa = get('txt-whatsapp');
  if (wa) { document.querySelectorAll('.contact-card strong').forEach(el => { if (el.textContent.startsWith('+')) el.textContent = wa; }); }
  const em = get('txt-email');
  if (em) { document.querySelectorAll('.contact-card strong, .footer-links p').forEach(el => { if (el.textContent.includes('@')) el.textContent = em; }); }
  const uk = get('txt-addr-uk');
  if (uk) { const el = document.querySelector('[data-addr="uk"]'); if (el) el.textContent = uk; }
  const ng = get('txt-addr-ng');
  if (ng) { const el = document.querySelector('[data-addr="ng"]'); if (el) el.textContent = ng; }

  // Footer
  const ftag = get('txt-footer-tag');
  if (ftag) { const el = document.querySelector('.footer-brand p'); if (el) el.textContent = ftag; }
  const nh = get('txt-newsletter-heading');
  if (nh) { const el = document.querySelector('.newsletter h3'); if (el) el.textContent = nh; }
  const ns = get('txt-newsletter-sub');
  if (ns) { const el = document.querySelector('.newsletter p'); if (el) el.textContent = ns; }
}
applyAdminText();

// ===== LOAD ADMIN REVIEWS INTO TESTIMONIALS =====
(function loadAdminReviews() {
  const saved = JSON.parse(localStorage.getItem('jf_reviews') || '[]');
  if (!saved.length) return;
  const track = document.getElementById('testi-track');
  if (!track) return;
  track.innerHTML = '';
  saved.forEach(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const initials = r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    track.innerHTML += `
      <div class="testi-card">
        <div class="testi-stars">${stars}</div>
        <p class="testi-text">"${r.text}"</p>
        <div class="testi-author">
          <div class="testi-avatar">${initials}</div>
          <div><strong>${r.name}</strong><span>${r.location}</span></div>
        </div>
      </div>`;
  });
})();

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

// Product filter tabs
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.product-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== TESTIMONIALS CAROUSEL =====
const track      = document.getElementById('testi-track');
const dotsWrap   = document.getElementById('testi-dots');
const totalCards = track ? track.children.length : 0;
let visibleCount = window.innerWidth <= 860 ? 1 : 3;
let testitIdx    = 0;
let maxIdx       = Math.max(0, totalCards - visibleCount);

// Build dots
if (dotsWrap) {
  for (let i = 0; i <= maxIdx; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => { testitIdx = i; applyTesti(); });
    dotsWrap.appendChild(d);
  }
}

function applyTesti() {
  if (!track) return;
  const cardW = track.parentElement.offsetWidth / visibleCount;
  track.style.transform = `translateX(-${testitIdx * cardW}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === testitIdx));
}

function moveTestimonial(dir) {
  testitIdx = Math.max(0, Math.min(testitIdx + dir, maxIdx));
  applyTesti();
}

// Auto-advance every 5s
setInterval(() => {
  testitIdx = testitIdx >= maxIdx ? 0 : testitIdx + 1;
  applyTesti();
}, 5000);

// Recalc on resize
window.addEventListener('resize', () => {
  visibleCount = window.innerWidth <= 860 ? 1 : 3;
  maxIdx = Math.max(0, totalCards - visibleCount);
  testitIdx = 0;
  applyTesti();
});

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-send');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#059669';
  setTimeout(() => {
    btn.textContent = '✈ Send Message';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// Newsletter form
function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Subscribed ✓';
  btn.style.background = '#059669';
  setTimeout(() => {
    btn.textContent = 'Subscribe →';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}
