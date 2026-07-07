/* ── Config ── Replace with your actual WhatsApp number (digits only, with country code, no + or spaces) */
const WA = '919879655156';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

/* ── Prices (INR, excl. GST) — override per item with data-price on .m-item / .prod-card */
const CATEGORY_PRICES = {
  bags: 3499,
  keychains: 499,
  beads: 1899,
  flowers: 499,
  minis: 2499,
};
const PAGE_PRICES = {
  'bags.html': CATEGORY_PRICES.bags,
  'keychains.html': CATEGORY_PRICES.keychains,
  'beads.html': CATEGORY_PRICES.beads,
  'flowers.html': CATEGORY_PRICES.flowers,
  'minis.html': CATEGORY_PRICES.minis,
};
const formatInr = n => Number(n).toLocaleString('en-IN');
const priceLabel = n => `₹${formatInr(n)} <span>+ GST</span>`;

function initPrices() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const pageDefault = PAGE_PRICES[page];

  document.querySelectorAll('.m-item').forEach(item => {
    if (item.querySelector('.m-item-price')) return;
    const amount = item.dataset.price || pageDefault;
    if (!amount) return;
    const nameEl = item.querySelector('.m-item-name');
    if (!nameEl) return;
    const el = document.createElement('p');
    el.className = 'm-item-price';
    el.innerHTML = priceLabel(amount);
    nameEl.insertAdjacentElement('afterend', el);
  });

  document.querySelectorAll('.prod-card[data-cat]').forEach(card => {
    if (card.querySelector('.prod-price')) return;
    const amount = card.dataset.price || CATEGORY_PRICES[card.dataset.cat];
    if (!amount) return;
    const title = card.querySelector('.prod-body h4');
    if (!title) return;
    const el = document.createElement('p');
    el.className = 'prod-price';
    el.innerHTML = priceLabel(amount);
    title.insertAdjacentElement('afterend', el);
  });
}

/* ── Nav scroll ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 40), {passive:true});

/* ── Hamburger ── */
const hamburger = document.querySelector('.hamburger');
const navEl = document.querySelector('nav');
hamburger?.addEventListener('click', () => {
  const open = navEl?.classList.toggle('menu-open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.nav-center a').forEach(a => a.addEventListener('click', () => {
  navEl?.classList.remove('menu-open');
  hamburger?.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ── WhatsApp links ── */
function applyWaLinks() {
  document.querySelectorAll('[data-wa]').forEach(el => {
    const href = waLink(el.dataset.wa);
    if (el.tagName === 'A') el.href = href;
    else el.addEventListener('click', () => window.open(href, '_blank'));
  });
}

/* ── Float WA button ── */
function initFloatBtn() {
  const btn = document.querySelector('.wa-float');
  if (btn) btn.href = waLink("Hi Asha! 🌸 I'd love to learn more about your handmade pieces and place an order.");
}

/* ── Lightbox ── */
let lbImgs = [], lbIdx = 0, lbCat = '';
const lb     = document.getElementById('lightbox');
const lbImg  = document.getElementById('lb-img');
const lbOrd  = document.getElementById('lb-order');

function openLb(imgs, i, cat) {
  lbImgs = imgs; lbIdx = i; lbCat = cat;
  showLb();
  lb?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function showLb() {
  if (!lbImg) return;
  lbImg.src = lbImgs[lbIdx];
  if (lbOrd) lbOrd.href = waLink(`Hi Asha! 🌸 I saw this piece in your ${lbCat} collection and I'd love to order it. Can you share details?`);
}
function closeLb() { lb?.classList.remove('open'); document.body.style.overflow = ''; }

document.getElementById('lb-close')?.addEventListener('click', closeLb);
document.getElementById('lb-prev')?.addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbImgs.length) % lbImgs.length; showLb(); });
document.getElementById('lb-next')?.addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbImgs.length; showLb(); });
lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLb();
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + lbImgs.length) % lbImgs.length; showLb(); }
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbImgs.length; showLb(); }
});

/* ── Gallery init ── */
function initGallery() {
  const items = [...document.querySelectorAll('.m-item[data-src]')];
  if (!items.length) return;
  const imgs = items.map(el => el.dataset.src);
  const cat  = document.querySelector('.page-header h1')?.textContent ?? 'Collection';
  items.forEach((el, i) => el.addEventListener('click', e => {
    if (e.target.closest('a, button, form, .razorpay-btn-wrap, .razorpay-payment-button')) return;
    openLb(imgs, i, cat);
  }));
}

/* ── Collection filter ── */
function initFilter() {
  const btns  = [...document.querySelectorAll('.filter-btn[data-cat]')];
  const cards = document.querySelectorAll('.prod-card[data-cat]');
  if (!btns.length) return;

  function applyFilter(cat) {
    cards.forEach(c => { c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none'; });
  }

  // Apply filter on click
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.cat);
  }));

  // Apply filter on load based on the active button
  const activeBtn = btns.find(b => b.classList.contains('active'));
  if (activeBtn) applyFilter(activeBtn.dataset.cat);
}

/* ── Bento category carousel (index landing page) ── */
const BENTO_CAROUSEL = {
  bags: [
    { src: 'images/Bags/f52ce3c7-527b-452b-b382-dafc6c96c5e1.jpg', pos: 'pos-mid' },
    { src: 'images/Bags/02309e31-70f7-40d9-953a-7c5b466cb317.jpg', pos: 'pos-mid' },
    { src: 'images/Bags/3a611cd5-9de5-4c1d-8d3f-68892b042ae3.jpg', pos: 'pos-mid' },
    { src: 'images/Bags/0f6b9a82-1973-4441-ba30-918980fc143b.jpg', pos: 'pos-mid' },
    { src: 'images/Bags/30288b92-4de9-4983-9a7d-35bd56fe1f95.jpg', pos: 'pos-mid' },
  ],
  minis: [
    { src: 'images/Minis/281ac88c-f82a-4333-9ef5-5f47b17570cd.jpg', pos: 'pos-top' },
    { src: 'images/Minis/a18b81df-28db-42e7-995d-a4bd4dc24908.jpg', pos: 'pos-mid' },
    { src: 'images/Minis/4e170b3c-e0d5-426d-ad02-1e1ad531d8d4.jpg', pos: 'pos-mid' },
    { src: 'images/Minis/abd46065-a954-4200-b78f-67a8c1b14f06.jpg', pos: 'pos-mid' },
    { src: 'images/Minis/c634b167-e9ea-470d-a605-680214bf2a8d.jpg', pos: 'pos-mid' },
  ],
  keychains: [
    { src: 'images/Keychain/4a3a2b40-6830-4c7a-bb96-46322406a916.jpg' },
    { src: 'images/Keychain/2b385be1-f2d8-4b8c-a8ee-116bc3fee76e.jpg' },
    { src: 'images/Keychain/4254d9ed-3c13-47fb-9094-6adaab165ac8.jpg' },
    { src: 'images/Keychain/8d4b9a1e-1f6e-4a27-bb13-c722f88e2782.jpg' },
    { src: 'images/Keychain/54542a14-4f12-4c50-993d-2b06403131fd.jpg' },
  ],
  beads: [
    { src: 'images/Beads/a9d7805b-a358-4307-b023-7293bedc69fd.jpg', pos: 'pos-mid' },
    { src: 'images/Beads/e48763e2-abc1-4611-90c5-62be261cc525.jpg', pos: 'pos-mid' },
    { src: 'images/Beads/c634b167-e9ea-470d-a605-680214bf2a8d.jpg', pos: 'pos-mid' },
    { src: 'images/Beads/daa6b489-37ac-41c6-9620-44c6ce104dcc.jpg', pos: 'pos-mid' },
    { src: 'images/Beads/3528718e-f493-4051-968b-745f7c0bdc8e.jpg', pos: 'pos-mid' },
  ],
  flowers: [
    { src: 'images/Flower/fede8deb-4d34-4329-86b0-78b4bf111c69.jpg' },
    { src: 'images/Flower/109a8d3b-d807-496a-b4fa-6a541827ec59.jpg' },
    { src: 'images/Flower/0693435e-62f5-45e5-94ba-02ac535800cd.jpg' },
    { src: 'images/Flower/667a3d75-7bcc-4f95-998c-0f3e4c245dad.jpg' },
    { src: 'images/Flower/a14c7477-7f07-474a-9745-7c5c2c342a60.jpg' },
  ],
};
const BENTO_INTERVAL = 4500;

function initBentoCarousel() {
  const cards = document.querySelectorAll('.bento-card[data-bento]');
  if (!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach(card => {
    const slides = BENTO_CAROUSEL[card.dataset.bento];
    if (!slides?.length) return;

    const label = card.querySelector('.bento-name')?.textContent ?? '';
    const fallback = card.querySelector(':scope > img');
    const wrap = document.createElement('div');
    wrap.className = 'bento-slideshow';

    slides.forEach((slide, i) => {
      const img = document.createElement('img');
      img.src = typeof slide === 'string' ? slide : slide.src;
      img.alt = label;
      img.loading = i === 0 ? 'eager' : 'lazy';
      const pos = typeof slide === 'object' ? slide.pos : '';
      if (pos) img.classList.add(pos);
      if (i === 0) img.classList.add('is-active');
      wrap.appendChild(img);
    });

    fallback?.replaceWith(wrap);
    if (reduced || slides.length < 2) return;

    const imgs = [...wrap.querySelectorAll('img')];
    let idx = 0;
    let timer = null;

    const next = () => {
      imgs[idx].classList.remove('is-active');
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add('is-active');
    };

    const start = () => { timer = setInterval(next, BENTO_INTERVAL); };
    const stop = () => { clearInterval(timer); timer = null; };

    card.addEventListener('mouseenter', stop);
    card.addEventListener('mouseleave', start);
    card.addEventListener('focusin', stop);
    card.addEventListener('focusout', start);

    slides.slice(1).forEach(slide => {
      const pre = new Image();
      pre.src = typeof slide === 'string' ? slide : slide.src;
    });

    start();
  });
}

/* ── Cat cards ── */
function initCatCards() {
  document.querySelectorAll('.cat-card[data-href]').forEach(c => {
    c.addEventListener('click', () => { window.location.href = c.dataset.href; });
  });
}

function initLightboxCopyright() {
  const wrap = document.querySelector('.lb-wrap');
  if (!wrap || wrap.querySelector('.lb-copy')) return;
  const note = document.createElement('p');
  note.className = 'lb-copy';
  note.textContent = '\u00A9 Asha\u2019s Knit \u2014 Photographed by Asha. All rights reserved.';
  wrap.appendChild(note);
}

document.addEventListener('DOMContentLoaded', () => {
  applyWaLinks();
  initFloatBtn();
  initPrices();
  initGallery();
  initFilter();
  initCatCards();
  initBentoCarousel();
  initLightboxCopyright();
});
