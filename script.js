function getPublicSiteModeConfig() {
  const config = window.JF_SITE_CONFIG || {};
  return {
    id: String(config.jsonBinId || '').trim(),
    readKey: String(config.jsonBinReadKey || '').trim()
  };
}

async function readConstructionStateFromJsonBin() {
  const { id, readKey } = getPublicSiteModeConfig();
  if (!id || !readKey) return false;

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest?meta=false`, {
      headers: { 'X-Access-Key': readKey }
    });

    if (!response.ok) return false;

    const record = await response.json();
    return record.construction === true;
  } catch (error) {
    return false;
  }
}

// ===== UNDER CONSTRUCTION GATE (reads from JSONBin and works on all devices) =====
(async function() {
  const isAdmin = sessionStorage.getItem('jf_admin') === 'true';
  const overlay = document.getElementById('uc-overlay');
  const banner = document.getElementById('uc-banner');
  const isUnderConstruction = await readConstructionStateFromJsonBin();

  if (isUnderConstruction) {
    if (isAdmin) {
      if (overlay) overlay.style.display = 'none';
      if (banner) banner.style.display = 'flex';
    } else {
      if (overlay) overlay.style.display = 'flex';
      if (banner) banner.style.display = 'none';
    }
  } else {
    if (overlay) overlay.style.display = 'none';
    if (banner) banner.style.display = 'none';
  }
})();

// ===== HERO SLIDESHOW =====
const heroSlides = [
  {
    badge: '\u{1F95C} 100% NATURAL \u00B7 NO PRESERVATIVES',
    heading: 'The Finest<br /><span class="highlight">Premium</span><br />Peanuts',
    desc: 'Enjoy the rich taste and crunchy goodness of Lifelink Peanuts. Carefully selected and processed to deliver freshness, quality, and nutrition in every bite.',
    img: 'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=500&q=80',
    alt: 'Premium Peanuts'
  },
  {
    badge: '\u{1F34C} CRISPY \u00B7 GOLDEN \u00B7 IRRESISTIBLE',
    heading: 'The Crunchiest<br /><span class="highlight">Premium</span><br />Plantain Chips',
    desc: 'Made from premium plantains and expertly prepared for the perfect crunch, Lifelink Plantain Chips offer a delicious and healthy snacking experience. Available in exciting flavors, they are the ideal choice for lovers of authentic African snacks.',
    img: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=500&q=80',
    alt: 'Premium Plantain Chips'
  },
  {
    badge: '\u{1F34E} NATURALLY DRIED \u00B7 NUTRIENT RICH',
    heading: 'Naturally Dried<br /><span class="highlight">Premium</span><br />Fruit Snacks',
    desc: "Experience nature's sweetness with Lifelink Dehydrated Fruits. Produced from carefully selected fresh fruits and naturally preserved to retain their flavor and nutrients, they provide a healthy, tasty, and convenient snack for people of all ages.",
    img: 'https://images.unsplash.com/photo-1604148056278-7e3b3f83ebde?w=500&q=80',
    alt: 'Dehydrated Fruit Snacks'
  }
];

let currentSlide = 0;

window.addEventListener('DOMContentLoaded', () => {
  const bg = document.getElementById('hero-bg');
  if (bg) bg.style.backgroundImage = `url('${heroSlides[0].img}')`;
});

function goToSlide(index) {
  currentSlide = index;
  const slide = heroSlides[index];
  const heading = document.getElementById('hero-heading');
  const desc = document.getElementById('hero-desc');
  const badge = document.getElementById('hero-badge');
  const bg = document.getElementById('hero-bg');
  const dots = document.querySelectorAll('.dot');

  if (!heading || !desc || !badge) return;

  heading.classList.remove('hero-fade');
  desc.classList.remove('hero-fade');
  void heading.offsetWidth;

  heading.innerHTML = slide.heading;
  desc.textContent = slide.desc;
  badge.textContent = slide.badge;

  if (bg) {
    bg.style.opacity = '0';
    setTimeout(() => {
      bg.style.backgroundImage = `url('${slide.img}')`;
      bg.style.opacity = '1';
    }, 400);
  }

  heading.classList.add('hero-fade');
  desc.classList.add('hero-fade');
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
}

function nextSlide() {
  goToSlide((currentSlide + 1) % heroSlides.length);
}

let slideTimer = setInterval(nextSlide, 60000);

document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideTimer);
    goToSlide(Number(dot.dataset.index));
    slideTimer = setInterval(nextSlide, 60000);
  });
});

// ===== LOAD ADMIN-UPLOADED IMAGES =====
function applyAdminImages() {
  const maps = [
    { key: 'cat-0', selector: '.varieties-grid .variety-card:nth-child(1) img' },
    { key: 'cat-1', selector: '.varieties-grid .variety-card:nth-child(2) img' },
    { key: 'cat-2', selector: '.varieties-grid .variety-card:nth-child(3) img' },
    { key: 'story-main', selector: '.story-img-main' },
    { key: 'prod-0', selector: '#products-grid .product-card:nth-child(1) img' },
    { key: 'prod-1', selector: '#products-grid .product-card:nth-child(2) img' },
    { key: 'prod-2', selector: '#products-grid .product-card:nth-child(3) img' },
    { key: 'prod-3', selector: '#products-grid .product-card:nth-child(4) img' },
    { key: 'prod-4', selector: '#products-grid .product-card:nth-child(5) img' },
    { key: 'prod-5', selector: '#products-grid .product-card:nth-child(6) img' },
    { key: 'prod-6', selector: '#products-grid .product-card:nth-child(7) img' },
    { key: 'prod-7', selector: '#products-grid .product-card:nth-child(8) img' }
  ];

  maps.forEach(({ key, selector }) => {
    const saved = localStorage.getItem('jf_img_' + key);
    if (!saved) return;
    const element = document.querySelector(selector);
    if (element) element.src = saved;
  });

  ['hero-0', 'hero-1', 'hero-2'].forEach((key, index) => {
    const saved = localStorage.getItem('jf_img_' + key);
    if (saved) heroSlides[index].img = saved;
  });
}
applyAdminImages();

function setMultilineHtml(selector, value) {
  const element = document.querySelector(selector);
  if (!element || !value) return;
  element.innerHTML = value.replace(/\n/g, '<br />');
}

function currentEmail() {
  const emailElement = document.querySelector('.contact-card.orange strong');
  return emailElement ? emailElement.textContent.trim() : 'info@lifelinkfoods.com';
}

function currentWhatsApp() {
  const whatsappElement = document.querySelector('.contact-card.green strong');
  return whatsappElement ? whatsappElement.textContent.replace(/\D/g, '') : '2348023176523';
}

// ===== APPLY ADMIN TEXT =====
function applyAdminText() {
  const get = key => localStorage.getItem('jf_txt_' + key);

  const heroHeading0 = get('txt-hero0-heading');
  const heroDesc0 = get('txt-hero0-desc');
  const heroHeading1 = get('txt-hero1-heading');
  const heroDesc1 = get('txt-hero1-desc');
  const heroHeading2 = get('txt-hero2-heading');
  const heroDesc2 = get('txt-hero2-desc');

  if (heroHeading0) heroSlides[0].heading = heroHeading0 + '<br />';
  if (heroDesc0) heroSlides[0].desc = heroDesc0;
  if (heroHeading1) heroSlides[1].heading = heroHeading1 + '<br />';
  if (heroDesc1) heroSlides[1].desc = heroDesc1;
  if (heroHeading2) heroSlides[2].heading = heroHeading2 + '<br />';
  if (heroDesc2) heroSlides[2].desc = heroDesc2;

  const storyHeading = get('txt-story-heading');
  if (storyHeading) {
    const element = document.querySelector('.story-text h2');
    if (element) element.textContent = storyHeading;
  }

  const storyParagraph1 = get('txt-story-p1');
  if (storyParagraph1) {
    const element = document.querySelector('.story-text p:nth-of-type(1)');
    if (element) element.textContent = storyParagraph1;
  }

  const storyParagraph2 = get('txt-story-p2');
  if (storyParagraph2) {
    const element = document.querySelector('.story-text p:nth-of-type(2)');
    if (element) element.textContent = storyParagraph2;
  }

  const whatsapp = get('txt-whatsapp');
  if (whatsapp) {
    document.querySelectorAll('.contact-card strong').forEach(element => {
      if (element.textContent.trim().startsWith('+')) element.textContent = whatsapp;
    });
    const whatsappLink = document.querySelector('.uc-wa');
    if (whatsappLink) whatsappLink.href = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;
  }

  const email = get('txt-email');
  if (email) {
    document.querySelectorAll('.contact-card strong, .footer-links p').forEach(element => {
      if (element.textContent.includes('@')) element.textContent = email;
    });
    const overlayEmail = document.querySelector('.uc-email');
    if (overlayEmail) {
      overlayEmail.href = `mailto:${email}`;
      overlayEmail.innerHTML = `&#9993; ${email}`;
    }
  }

  setMultilineHtml('[data-addr="uk"]', get('txt-addr-uk'));
  setMultilineHtml('[data-addr="ng"]', get('txt-addr-ng'));

  const footerTag = get('txt-footer-tag');
  if (footerTag) {
    const element = document.querySelector('.footer-brand p');
    if (element) element.textContent = footerTag;
  }

  const newsletterHeading = get('txt-newsletter-heading');
  if (newsletterHeading) {
    const element = document.querySelector('.newsletter h3');
    if (element) element.textContent = newsletterHeading;
  }

  const newsletterSubtext = get('txt-newsletter-sub');
  if (newsletterSubtext) {
    const element = document.querySelector('.newsletter p');
    if (element) element.textContent = newsletterSubtext;
  }
}
applyAdminText();

// ===== LOAD ADMIN REVIEWS INTO TESTIMONIALS =====
(function loadAdminReviews() {
  const saved = JSON.parse(localStorage.getItem('jf_reviews') || '[]');
  if (!saved.length) return;

  const trackElement = document.getElementById('testi-track');
  if (!trackElement) return;

  trackElement.innerHTML = '';
  saved.forEach(review => {
    const stars = '\u2605'.repeat(review.rating) + '\u2606'.repeat(5 - review.rating);
    const initials = review.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    trackElement.innerHTML += `
      <div class="testi-card">
        <div class="testi-stars">${stars}</div>
        <p class="testi-text">"${review.text}"</p>
        <div class="testi-author">
          <div class="testi-avatar">${initials}</div>
          <div><strong>${review.name}</strong><span>${review.location}</span></div>
        </div>
      </div>`;
  });
})();

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.product-card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !matches);
    });
  });
});

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('testi-track');
const dotsWrap = document.getElementById('testi-dots');
const totalCards = track ? track.children.length : 0;
let visibleCount = window.innerWidth <= 860 ? 1 : 3;
let testimonialIndex = 0;
let maxIndex = Math.max(0, totalCards - visibleCount);

if (dotsWrap) {
  for (let index = 0; index <= maxIndex; index += 1) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      testimonialIndex = index;
      applyTestimonialTrack();
    });
    dotsWrap.appendChild(dot);
  }
}

function applyTestimonialTrack() {
  if (!track) return;
  const cardWidth = track.parentElement.offsetWidth / visibleCount;
  track.style.transform = `translateX(-${testimonialIndex * cardWidth}px)`;
  document.querySelectorAll('.testi-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === testimonialIndex);
  });
}

function moveTestimonial(direction) {
  testimonialIndex = Math.max(0, Math.min(testimonialIndex + direction, maxIndex));
  applyTestimonialTrack();
}
window.moveTestimonial = moveTestimonial;

setInterval(() => {
  testimonialIndex = testimonialIndex >= maxIndex ? 0 : testimonialIndex + 1;
  applyTestimonialTrack();
}, 5000);

window.addEventListener('resize', () => {
  visibleCount = window.innerWidth <= 860 ? 1 : 3;
  maxIndex = Math.max(0, totalCards - visibleCount);
  testimonialIndex = 0;
  applyTestimonialTrack();
});

// ===== CONTACT FORM =====
(function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    const action = form.getAttribute('action') || '';
    if (!action.includes('YOUR_FORM_ID')) return;

    event.preventDefault();

    const name = form.querySelector('#name')?.value.trim() || 'Website visitor';
    const email = form.querySelector('#email')?.value.trim() || '';
    const message = form.querySelector('#message')?.value.trim() || '';
    const targetEmail = currentEmail();
    const button = form.querySelector('.btn-send');
    const subject = encodeURIComponent('Website enquiry from ' + name);
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'WhatsApp: ' + currentWhatsApp() + '\n\n' +
      message
    );

    if (button) {
      button.textContent = 'Opening email app...';
      button.style.background = '#059669';
    }

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      if (button) {
        button.textContent = '\u2708 Send Message';
        button.style.background = '';
      }
    }, 3000);
  });
})();

// ===== NEWSLETTER FORM =====
function handleNewsletter(event) {
  event.preventDefault();
  const button = event.target.querySelector('button');
  if (!button) return;

  button.textContent = 'Subscribed \u2713';
  button.style.background = '#059669';

  setTimeout(() => {
    button.textContent = 'Subscribe \u2192';
    button.style.background = '';
    event.target.reset();
  }, 3000);
}
window.handleNewsletter = handleNewsletter;
