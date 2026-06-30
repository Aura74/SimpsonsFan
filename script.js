/* ============================================================
   LYCKOKULAN — store logic (no backend, all localStorage)
   ============================================================ */
(function () {
  'use strict';

  const NS = 'lyckokulan';
  const FREE_SHIP = 499;
  const kr = n => n.toLocaleString('sv-SE') + ' kr';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k, fb) { try { return JSON.parse(localStorage.getItem(NS + ':' + k)) ?? fb; } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem(NS + ':' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- PRODUCTS ---------- */
  const PRODUCTS = [
    { id: 'vanilj', name: 'Madagaskarvanilj', flavor: 'Krämig vanilj med äkta vaniljfrön', price: 69, img: 'images/prod-vanilj.jpg', cats: ['klassiker', 'bast'], rating: 4.9, reviews: 320, allergens: 'Mjölk, ägg', badges: [{ t: 'Bästsäljare', c: 'bast' }], pop: 98 },
    { id: 'saltkola', name: 'Saltkola & Nougat', flavor: 'Len kola, rostad nougat, ett nyp havssalt', price: 75, img: 'images/prod-saltkola.jpg', cats: ['klassiker', 'bast'], rating: 4.9, reviews: 290, allergens: 'Mjölk, nötter', badges: [{ t: 'Bästsäljare', c: 'bast' }], pop: 96 },
    { id: 'regnbage', name: 'Regnbåge', flavor: 'Barnens favorit – färg från riktig frukt & bär', price: 65, img: 'images/prod-regnbage.jpg', cats: ['barn', 'bast'], rating: 4.9, reviews: 310, allergens: 'Mjölk', badges: [{ t: 'Barnfavorit', c: 'barn' }, { t: 'Bästsäljare', c: 'bast' }], pop: 95 },
    { id: 'cookies', name: 'Cookies & Cream', flavor: 'Vaniljkräm full av chokladkakbitar', price: 72, img: 'images/prod-cookies.jpg', cats: ['klassiker', 'bast'], rating: 4.8, reviews: 260, allergens: 'Mjölk, gluten, ägg', badges: [{ t: 'Bästsäljare', c: 'bast' }], pop: 92 },
    { id: 'choklad', name: 'Chokladdröm', flavor: 'Mörk belgisk choklad, sammetslen', price: 72, img: 'images/prod-choklad.jpg', cats: ['klassiker'], rating: 4.8, reviews: 210, allergens: 'Mjölk', badges: [], pop: 88 },
    { id: 'mynta', name: 'Mynta & Chokladflingor', flavor: 'Frisk mynta med knapriga chokladflingor', price: 69, img: 'images/prod-mynta.jpg', cats: ['klassiker'], rating: 4.7, reviews: 180, allergens: 'Mjölk', badges: [], pop: 80 },
    { id: 'hallon', name: 'Hallon på pinne', flavor: 'Solmogna hallon – 6 pinnar, helt växtbaserat', price: 59, img: 'images/prod-hallon.jpg', cats: ['pinnglass', 'vegan'], rating: 4.8, reviews: 175, allergens: 'Inga', badges: [{ t: 'Vegansk', c: 'vegan' }, { t: 'Ny', c: 'ny' }], pop: 86 },
    { id: 'blastjarna', name: 'Blå Stjärna', flavor: 'Blåbär & vanilj med stjärnströssel', price: 65, img: 'images/prod-blastjarna.jpg', cats: ['barn'], rating: 4.7, reviews: 150, allergens: 'Mjölk', badges: [{ t: 'Barnfavorit', c: 'barn' }], pop: 78 },
    { id: 'stracciatella', name: 'Stracciatella', flavor: 'Italiensk gräddglass med chokladådror', price: 72, img: 'images/prod-stracciatella.jpg', cats: ['klassiker'], rating: 4.6, reviews: 140, allergens: 'Mjölk', badges: [], pop: 74 },
    { id: 'blabar', name: 'Blåbär & Lavendel', flavor: 'Sorbet på vilda blåbär & en aning lavendel', price: 75, img: 'images/prod-blabar.jpg', cats: ['vegan'], rating: 4.7, reviews: 120, allergens: 'Inga', badges: [{ t: 'Vegansk', c: 'vegan' }, { t: 'Ny', c: 'ny' }], pop: 72 },
    { id: 'mango', name: 'Mango-tango', flavor: 'Solmogen mango & passion – frisk vegansk sorbet', price: 69, img: 'images/prod-mango.jpg', cats: ['vegan', 'barn'], rating: 4.8, reviews: 165, allergens: 'Inga', badges: [{ t: 'Vegansk', c: 'vegan' }, { t: 'Ny', c: 'ny' }], pop: 84 },
    { id: 'pistage', name: 'Pistage', flavor: 'Rostad Brontepistage – krämig & nötig', price: 79, img: 'images/prod-pistage.jpg', cats: ['klassiker'], rating: 4.8, reviews: 190, allergens: 'Mjölk, nötter', badges: [{ t: 'Ny', c: 'ny' }], pop: 83 }
  ];
  const byId = id => PRODUCTS.find(p => p.id === id);
  const stars = r => '★★★★★'.slice(0, Math.round(r)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(r));

  // pack variants (no backend — just price multipliers)
  const VARIANTS = [
    { key: '1', label: '1-pack', sub: '≈500 ml', mult: 1 },
    { key: '4', label: '4-pack', sub: 'spara 10%', mult: 3.6 },
    { key: 'tub', label: 'Familjetub', sub: '≈900 ml', mult: 1.6 }
  ];
  // plausible nutrition per 100 ml (sorbet/vegan = lätt, gräddglass = rikare)
  function nutrition(p) {
    const light = p.cats.includes('vegan');
    return light
      ? { energi: '132 kcal', fett: '0,3 g', kolhydrat: '31 g', socker: '28 g', protein: '0,5 g' }
      : { energi: '212 kcal', fett: '12 g', kolhydrat: '22 g', socker: '20 g', protein: '3,6 g' };
  }
  const REVIEWS = [
    ['Maria', 5, 'Mina barn ber om den varje fredag – och den är ekologisk!'],
    ['Johan', 5, 'Krämigast jag ätit. Kom stenhård trots värmen.'],
    ['Sara', 4, 'Underbar smak, lagom söt. Blir stammis.']
  ];

  /* ---------- STATE ---------- */
  let cart = store.get('cart', []);
  let wishlist = store.get('wishlist', []);
  let discountCode = store.get('discount', '') || '';
  const DISCOUNTS = { 'LYCKA10': 0.10 };
  const discountRate = () => DISCOUNTS[discountCode] || 0;
  const discountAmount = () => Math.round(cartTotal() * discountRate());
  const payableTotal = () => cartTotal() - discountAmount();
  let filter = 'alla';
  let sort = 'pop';
  let query = '';
  let expanded = false;

  /* ---------- PRODUCT GRID ---------- */
  const grid = $('#product-grid');
  const emptyMsg = $('#shop-empty');
  const moreWrap = $('#shop-more-wrap');
  const moreBtn = $('#shop-more');
  const isMobile = () => window.matchMedia('(max-width: 680px)').matches;

  function applyCollapse(count) {
    const collapsible = isMobile() && count > 4;
    moreWrap.classList.toggle('is-visible', collapsible);
    grid.classList.toggle('is-collapsed', collapsible && !expanded);
    if (collapsible) moreBtn.textContent = expanded ? 'Visa färre' : `Visa alla ${count} smaker`;
  }
  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    const count = $$('.card', grid).length;
    grid.classList.toggle('is-collapsed', !expanded);
    moreBtn.textContent = expanded ? 'Visa färre' : `Visa alla ${count} smaker`;
    if (!expanded) document.getElementById('smaker').scrollIntoView({ behavior: 'smooth' });
  });
  window.addEventListener('resize', () => applyCollapse($$('.card', grid).length));

  function cardHTML(p) {
    const wished = wishlist.includes(p.id);
    const badges = p.badges.map(b => `<span class="tag tag--${b.c}">${b.t}</span>`).join('');
    return `<article class="card" data-id="${p.id}">
      <div class="card__media">
        <div class="card__badges">${badges}</div>
        <button class="card__heart ${wished ? 'is-active' : ''}" data-act="wish" aria-label="Spara som favorit">
          <svg viewBox="0 0 24 24" class="ic"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async" width="400" height="400" onerror="this.style.opacity=.25">
        <span class="card__brand"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 22 L24 44 L34 22 Z" fill="#E8B07A"/><circle cx="24" cy="19" r="13" fill="var(--hallon)"/><circle cx="16" cy="15" r="8" fill="var(--mynta)"/><circle cx="31" cy="16" r="7" fill="var(--lavender)"/></svg>Lyckokulan</span>
        <button class="card__quick" data-act="quick">Snabbvy</button>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__flavor">${p.flavor}</p>
        <p class="card__rating"><span class="stars">${stars(p.rating)}</span> ${p.rating.toFixed(1)} · ${p.reviews} omdömen</p>
        <div class="card__foot">
          <span class="card__price">${kr(p.price)} <small>/ förp.</small></span>
          <button class="card__add" data-act="add" aria-label="Lägg ${p.name} i kundvagnen">+</button>
        </div>
      </div>
    </article>`;
  }

  function renderGrid() {
    let list = PRODUCTS.filter(p => {
      const f = filter === 'alla' || p.cats.includes(filter);
      const q = !query || (p.name + ' ' + p.flavor).toLowerCase().includes(query);
      return f && q;
    });
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
    else list.sort((a, b) => b.pop - a.pop);

    grid.innerHTML = list.map(cardHTML).join('');
    emptyMsg.hidden = list.length > 0;
    expanded = false;
    applyCollapse(list.length);
  }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.card'); if (!card) return;
    const id = card.dataset.id;
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'add') { flyToCart($('img', card)); addToCart(id); }
    else if (act === 'wish') toggleWish(id, e.target.closest('.card__heart'));
    else if (act === 'quick') openQuick(id);
    else if (e.target.closest('.card__media') || e.target.closest('.card__name')) openQuick(id);
  });

  /* filters / sort / search */
  $('#filters').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $$('.chip', $('#filters')).forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    filter = c.dataset.filter; renderGrid();
  });
  $('#sort').addEventListener('change', e => { sort = e.target.value; renderGrid(); });
  $('#shop-search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); renderGrid(); });

  /* ---------- CART ---------- */
  const cartDrawer = $('#cart-drawer');
  function saveCart() { store.set('cart', cart); renderCart(); updateCounts(); }
  function cartQty() { return cart.reduce((s, i) => s + i.qty, 0); }
  function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

  function addToCart(id, opts) {
    const p = byId(id);
    const item = opts || (p && { id: p.id, name: p.name, img: p.img, price: p.price, meta: '1 förpackning' });
    if (!item) return;
    const existing = cart.find(i => i.id === item.id && i.meta === item.meta);
    if (existing) existing.qty += (item.qty || 1);
    else cart.push({ ...item, qty: item.qty || 1 });
    saveCart();
    toast('🛒 Tillagd i kundvagnen');
    bump($('#cart-btn'));
  }
  function setQty(idx, d) {
    cart[idx].qty += d;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart();
  }
  function removeItem(idx) { cart.splice(idx, 1); saveCart(); toast('Borttagen'); }

  function renderCart() {
    cartDrawer.classList.toggle('is-empty', cart.length === 0);
    const body = $('#cart-items');
    body.innerHTML = cart.map((i, idx) => `<div class="line">
      <img src="${i.img}" alt="${i.name}" onerror="this.style.visibility='hidden'">
      <div class="line__info">
        <div class="line__name">${i.name}</div>
        <div class="line__meta">${i.meta || ''}</div>
        <div class="qty">
          <button data-q="-1" data-i="${idx}" aria-label="Minska">−</button>
          <span>${i.qty}</span>
          <button data-q="1" data-i="${idx}" aria-label="Öka">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="line__price">${kr(i.price * i.qty)}</div>
        <button class="line__remove" data-rm="${idx}">Ta bort</button>
      </div>
    </div>`).join('');
    const items = cartTotal(), disc = discountAmount();
    const dl = $('#discount-line');
    if (dl) { dl.hidden = disc === 0; $('#discount-label').textContent = 'Rabatt (' + discountCode + ')'; $('#discount-amt').textContent = '−' + kr(disc); }
    const di = $('#discount-input'); if (di && discountCode && di.value.toUpperCase() !== discountCode) di.value = discountCode;
    $('#cart-subtotal').textContent = kr(payableTotal());

    const pct = Math.min(100, (items / FREE_SHIP) * 100);
    $('#ship-fill').style.width = pct + '%';
    $('#ship-text').innerHTML = items >= FREE_SHIP
      ? '🎉 Du har <strong>fri frakt!</strong>'
      : `Handla för <strong>${kr(FREE_SHIP - items)}</strong> till för fri frakt`;
  }
  /* discount code */
  function applyDiscount() {
    const code = ($('#discount-input').value || '').trim().toUpperCase();
    if (DISCOUNTS[code]) { discountCode = code; store.set('discount', code); toast('🎉 ' + Math.round(DISCOUNTS[code] * 100) + '% rabatt tillagd!'); }
    else { discountCode = ''; store.set('discount', ''); toast('🤔 Ogiltig kod – prova LYCKA10'); }
    renderCart();
  }
  $('#discount-apply').addEventListener('click', applyDiscount);
  $('#discount-input').addEventListener('keydown', e => { if (e.key === 'Enter') applyDiscount(); });
  $('#cart-items').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'); const rm = e.target.closest('[data-rm]');
    if (q) setQty(+q.dataset.i, +q.dataset.q);
    if (rm) removeItem(+rm.dataset.rm);
  });

  /* ---------- WISHLIST ---------- */
  const wishDrawer = $('#wishlist-drawer');
  function toggleWish(id, btn) {
    const i = wishlist.indexOf(id);
    if (i >= 0) { wishlist.splice(i, 1); btn && btn.classList.remove('is-active'); toast('💔 Borttagen från favoriter'); }
    else { wishlist.push(id); btn && btn.classList.add('is-active'); toast('💛 Sparad som favorit'); bump($('#wishlist-btn')); }
    store.set('wishlist', wishlist); updateCounts(); renderWish();
  }
  function renderWish() {
    wishDrawer.classList.toggle('is-empty', wishlist.length === 0);
    $('#wishlist-items').innerHTML = wishlist.map(id => {
      const p = byId(id); if (!p) return '';
      return `<div class="line">
        <img src="${p.img}" alt="${p.name}">
        <div class="line__info"><div class="line__name">${p.name}</div><div class="line__meta">${kr(p.price)}</div></div>
        <div style="display:flex;flex-direction:column;gap:.3rem">
          <button class="btn btn--primary btn--sm" data-wadd="${id}">Köp</button>
          <button class="line__remove" data-wrm="${id}">Ta bort</button>
        </div>
      </div>`;
    }).join('');
  }
  $('#wishlist-items').addEventListener('click', e => {
    const a = e.target.closest('[data-wadd]'); const r = e.target.closest('[data-wrm]');
    if (a) addToCart(a.dataset.wadd);
    if (r) { toggleWish(r.dataset.wrm); syncHearts(); }
  });
  function syncHearts() { $$('.card').forEach(c => $('.card__heart', c)?.classList.toggle('is-active', wishlist.includes(c.dataset.id))); }

  /* ---------- COUNTS ---------- */
  function updateCounts() {
    const cc = $('#cart-count'), wc = $('#wishlist-count');
    const cq = cartQty(), wq = wishlist.length;
    cc.textContent = cq; cc.hidden = cq === 0;
    wc.textContent = wq; wc.hidden = wq === 0;
  }

  /* ---------- QUICK VIEW ---------- */
  const qv = $('#quickview');
  let pdp = { id: null, variant: '1', qty: 1 };
  const pdpPrice = p => Math.round(p.price * VARIANTS.find(v => v.key === pdp.variant).mult);

  function renderPDP() {
    const p = byId(pdp.id); if (!p) return;
    const n = nutrition(p);
    const thumbs = [p.img, 'images/bowl.jpg', 'images/joy.jpg'];
    $('#quickview-card').innerHTML = `
      <button class="pdp__close" aria-label="Stäng">✕</button>
      <div class="pdp">
        <div class="pdp__gallery">
          <div class="pdp__main"><img id="pdp-main" src="${p.img}" alt="${p.name}"></div>
          <div class="pdp__thumbs">${thumbs.map((t, i) => `<button class="${i === 0 ? 'is-active' : ''}" data-thumb="${t}"><img src="${t}" alt=""></button>`).join('')}</div>
        </div>
        <div class="pdp__body">
          <p class="pdp__crumb">Smaker / ${p.name}</p>
          <div>${p.badges.map(b => `<span class="tag tag--${b.c}">${b.t}</span>`).join(' ')}</div>
          <h3 class="pdp__name">${p.name}</h3>
          <p class="pdp__rating"><span class="stars">${stars(p.rating)}</span> ${p.rating.toFixed(1)} · ${p.reviews} omdömen</p>
          <p class="pdp__price" id="pdp-price">${kr(pdpPrice(p))} <small>inkl. moms</small></p>
          <p class="pdp__desc">${p.flavor}. Tillverkad på svensk ekologisk grädde i små satser, utan konstgjorda färger eller smaker.</p>
          <p class="pdp__vlabel">Välj storlek</p>
          <div class="pdp__variants">${VARIANTS.map(v => `<button class="variant ${v.key === pdp.variant ? 'is-active' : ''}" data-variant="${v.key}">${v.label}<small>${v.sub}</small></button>`).join('')}</div>
          <div class="pdp__buy">
            <div class="pdp__qty"><button data-pq="-1" aria-label="Minska">−</button><span id="pdp-qty">${pdp.qty}</span><button data-pq="1" aria-label="Öka">+</button></div>
            <button class="btn btn--primary" data-pdpadd>Lägg i kundvagn</button>
            <button class="card__heart ${wishlist.includes(p.id) ? 'is-active' : ''}" data-pdpwish aria-label="Spara som favorit" style="position:static">
              <svg viewBox="0 0 24 24" class="ic"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            </button>
          </div>
          <div class="pdp__section">
            <h4>Näringsvärde <span style="font-weight:400;color:var(--muted);font-size:.8rem">per 100 ml</span></h4>
            <table class="nutri">
              <tr><td>Energi</td><td>${n.energi}</td></tr>
              <tr><td>Fett</td><td>${n.fett}</td></tr>
              <tr><td>Kolhydrat (varav socker)</td><td>${n.kolhydrat} (${n.socker})</td></tr>
              <tr><td>Protein</td><td>${n.protein}</td></tr>
            </table>
          </div>
          <div class="pdp__section">
            <h4>Innehåll &amp; allergener</h4>
            <p class="pdp__desc">Ekologisk grädde, ekologisk mjölk, råsocker, naturliga smaker. <strong>Allergener:</strong> ${p.allergens}. Förvaras vid −18 °C.</p>
          </div>
          <div class="pdp__section">
            <h4>Omdömen (${p.reviews})</h4>
            ${REVIEWS.map(r => `<div class="pdp__rev"><span class="stars">${stars(r[1])}</span><b>${r[0]}</b><p>${r[2]}</p></div>`).join('')}
          </div>
        </div>
      </div>`;
  }
  function openQuick(id) {
    if (!byId(id)) return;
    pdp = { id, variant: '1', qty: 1 };
    renderPDP();
    try { history.replaceState(null, '', '#produkt/' + id); } catch (e) {}
    openModal(qv);
  }
  function closePDP() {
    closeModal(qv);
    if (location.hash.indexOf('#produkt/') === 0) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  }
  qv.addEventListener('click', e => {
    if (e.target === qv || e.target.closest('.pdp__close')) return closePDP();
    const p = byId(pdp.id); if (!p) return;
    const thumb = e.target.closest('[data-thumb]');
    const variant = e.target.closest('[data-variant]');
    const pq = e.target.closest('[data-pq]');
    if (thumb) { $('#pdp-main').src = thumb.dataset.thumb; $$('.pdp__thumbs button', qv).forEach(b => b.classList.toggle('is-active', b === thumb)); return; }
    if (variant) { pdp.variant = variant.dataset.variant; $$('.variant', qv).forEach(b => b.classList.toggle('is-active', b === variant)); $('#pdp-price').innerHTML = `${kr(pdpPrice(p))} <small>inkl. moms</small>`; return; }
    if (pq) { pdp.qty = Math.max(1, pdp.qty + (+pq.dataset.pq)); $('#pdp-qty').textContent = pdp.qty; return; }
    if (e.target.closest('[data-pdpadd]')) {
      const v = VARIANTS.find(v => v.key === pdp.variant);
      flyToCart($('#pdp-main'));
      addToCart(p.id + '-' + v.key, { id: p.id + '-' + v.key, name: p.name, img: p.img, price: pdpPrice(p), meta: v.label, qty: pdp.qty });
      closePDP(); return;
    }
    if (e.target.closest('[data-pdpwish]')) { toggleWish(p.id, e.target.closest('[data-pdpwish]')); syncHearts(); }
  });
  // open PDP from a #produkt/<id> URL on load
  if (location.hash.indexOf('#produkt/') === 0) {
    const id = location.hash.slice('#produkt/'.length);
    if (byId(id)) setTimeout(() => openQuick(id), 300);
  }

  /* ---------- BOX BUILDER ---------- */
  const boxFlavors = $('#box-flavors');
  const boxSlots = $('#box-slots');
  let box = [];
  const BOX_MAX = 6, BOX_PRICE = 299;
  boxFlavors.innerHTML = PRODUCTS.map(p =>
    `<button class="flavor-pick" data-box="${p.id}"><img src="${p.img}" alt=""><span>${p.name}</span></button>`).join('');
  function renderBox() {
    boxSlots.innerHTML = Array.from({ length: BOX_MAX }, (_, i) => {
      if (box[i]) { const p = byId(box[i]); return `<div class="box__slot"><img src="${p.img}" alt="${p.name}"><button data-boxrm="${i}" aria-label="Ta bort">✕</button></div>`; }
      return `<div class="box__slot">🍦</div>`;
    }).join('');
    const full = box.length === BOX_MAX;
    $('#box-add').disabled = !full;
    $('#box-hint').textContent = full ? 'Boxen är full – redo att läggas till!' : `Välj ${BOX_MAX - box.length} smak(er) till.`;
  }
  boxFlavors.addEventListener('click', e => {
    const b = e.target.closest('[data-box]'); if (!b) return;
    if (box.length >= BOX_MAX) { toast('Boxen är redan full 🍨'); return; }
    box.push(b.dataset.box); renderBox();
  });
  boxSlots.addEventListener('click', e => {
    const rm = e.target.closest('[data-boxrm]'); if (!rm) return;
    box.splice(+rm.dataset.boxrm, 1); renderBox();
  });
  $('#box-add').addEventListener('click', () => {
    const names = box.map(id => byId(id).name);
    addToCart('box-' + Date.now(), { id: 'box-' + Date.now(), name: 'Egen 6-pack', img: box[0] ? byId(box[0]).img : 'images/bowl.jpg', price: BOX_PRICE, meta: names.join(', ') });
    box = []; renderBox(); openDrawer(cartDrawer);
  });
  renderBox();

  /* ---------- SUBSCRIPTION ---------- */
  $$('[data-sub]').forEach(b => b.addEventListener('click', () => {
    addToCart('sub-' + b.dataset.sub, { id: 'sub-' + b.dataset.sub, name: 'Glassklubben – ' + b.dataset.sub, img: 'images/joy.jpg', price: +b.dataset.price, meta: 'Prenumeration / månad' });
    openDrawer(cartDrawer);
  }));

  /* ---------- CHECKOUT (fake) ---------- */
  $('#checkout-btn').addEventListener('click', () => {
    if (!cart.length) return;
    const items = cartTotal(), disc = discountAmount();
    const ship = items >= FREE_SHIP ? 0 : 49;
    const discRow = disc ? `<div style="display:flex;justify-content:space-between;color:var(--mynta-deep)"><span>Rabatt (${discountCode})</span><span>−${kr(disc)}</span></div>` : '';
    $('#checkout-card').innerHTML = `
      <div class="popup__emoji">🍨</div>
      <h2 style="font-family:var(--font-display);font-size:1.7rem;margin:.3rem 0">Tack för din beställning!</h2>
      <p style="color:var(--text-soft);margin:.5rem 0 1rem">Det här är en demo – ingen riktig betalning sker. I en skarp butik skulle nästa steg vara <strong>Stripe Checkout</strong> eller <strong>Klarna</strong>.</p>
      <div style="text-align:left;background:var(--bg-alt);border-radius:var(--r);padding:1rem 1.2rem;margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between"><span>Varor (${cartQty()})</span><span>${kr(items)}</span></div>
        ${discRow}
        <div style="display:flex;justify-content:space-between"><span>Frakt</span><span>${ship === 0 ? 'Gratis' : kr(ship)}</span></div>
        <div style="display:flex;justify-content:space-between;font-family:var(--font-display);font-size:1.2rem;margin-top:.5rem;padding-top:.5rem;border-top:1px solid var(--hairline)"><strong>Totalt</strong><strong>${kr(payableTotal() + ship)}</strong></div>
      </div>
      <button class="btn btn--primary btn--block" id="checkout-done">Klart!</button>`;
    closeDrawer(cartDrawer);
    openModal($('#checkout-modal'));
  });
  $('#checkout-modal').addEventListener('click', e => {
    if (e.target === $('#checkout-modal') || e.target.id === 'checkout-done') {
      closeModal($('#checkout-modal'));
      if (e.target.id === 'checkout-done') { cart = []; saveCart(); toast('🎉 Tack! Din glass är på väg (på låtsas)'); }
    }
  });

  /* ---------- DRAWERS / MODALS ---------- */
  const overlay = $('#overlay');
  let openDrawerEl = null;
  function openDrawer(d) {
    openDrawerEl = d; overlay.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add('is-open'); d.classList.add('is-open'); });
    d.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
  function closeDrawer(d) {
    d.classList.remove('is-open'); overlay.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    setTimeout(() => { if (!$('.drawer.is-open')) overlay.hidden = true; }, 380);
    openDrawerEl = null;
  }
  overlay.addEventListener('click', () => openDrawerEl && closeDrawer(openDrawerEl));
  $('#cart-btn').addEventListener('click', () => { renderCart(); openDrawer(cartDrawer); });
  $('#cart-close').addEventListener('click', () => closeDrawer(cartDrawer));
  $('#wishlist-btn').addEventListener('click', () => { renderWish(); openDrawer(wishDrawer); });
  $('#wishlist-close').addEventListener('click', () => closeDrawer(wishDrawer));
  $('#cart-empty-shop').addEventListener('click', () => { closeDrawer(cartDrawer); location.hash = '#smaker'; });
  $('#wishlist-empty-shop').addEventListener('click', () => { closeDrawer(wishDrawer); location.hash = '#smaker'; });

  function openModal(m) { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeModal(m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); if (!$('.drawer.is-open')) document.body.style.overflow = ''; }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    $$('.modal.is-open').forEach(closeModal);
    if (openDrawerEl) closeDrawer(openDrawerEl);
    closePopup();
  });

  /* ---------- HEADER / NAV ---------- */
  const header = $('#header'), nav = $('#nav'), hb = $('#hamburger');
  hb.addEventListener('click', () => { const o = nav.classList.toggle('is-open'); hb.classList.toggle('is-open', o); });
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('is-open'); hb.classList.remove('is-open'); } });
  $('#nav-close').addEventListener('click', () => { nav.classList.remove('is-open'); hb.classList.remove('is-open'); });

  // search bar
  const sb = $('#searchbar'), si = $('#search-input');
  $('#search-btn').addEventListener('click', () => {
    const show = sb.hidden; sb.hidden = !show;
    if (show) si.focus();
  });
  $('#search-close').addEventListener('click', () => { sb.hidden = true; });
  si.addEventListener('input', e => {
    query = e.target.value.trim().toLowerCase();
    $('#shop-search').value = e.target.value;
    renderGrid();
  });
  si.addEventListener('keydown', e => { if (e.key === 'Enter') { sb.hidden = true; document.getElementById('smaker').scrollIntoView({ behavior: 'smooth' }); } });

  // announce close
  $('#announce-close').addEventListener('click', () => { $('#announce').classList.add('is-hidden'); store.set('announce', 'closed'); });
  if (store.get('announce') === 'closed') $('#announce').classList.add('is-hidden');

  /* ---------- THEME ---------- */
  $('#theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', 'dark');
    store.set ? localStorage.setItem('theme', dark ? 'light' : 'dark') : 0;
  });

  /* ---------- TO TOP ---------- */
  const toTop = $('#to-top');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- NEWSLETTER ---------- */
  $('#newsletter-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('🎉 Välkommen till Lyckoklubben! Kod: LYCKA10'); });

  /* ---------- DISCOUNT POPUP ---------- */
  const popup = $('#popup');
  function openPopup() { popup.classList.add('is-open'); popup.setAttribute('aria-hidden', 'false'); }
  function closePopup() { popup.classList.remove('is-open'); popup.setAttribute('aria-hidden', 'true'); store.set('popup', 'seen'); }
  $('#popup-close').addEventListener('click', closePopup);
  $('#popup-skip').addEventListener('click', closePopup);
  $('#popup').addEventListener('click', e => { if (e.target === popup) closePopup(); });
  $('#popup-form').addEventListener('submit', e => { e.preventDefault(); closePopup(); toast('🎉 Din kod: LYCKA10 (10% rabatt)'); });
  if (!store.get('popup')) setTimeout(() => { if (!$('.drawer.is-open') && !$('.modal.is-open')) openPopup(); }, 9000);

  /* ---------- COOKIE ---------- */
  const cookie = $('#cookie');
  if (!store.get('cookies')) setTimeout(() => { cookie.hidden = false; }, 1200);
  $('#cookie-accept').addEventListener('click', () => { store.set('cookies', 'all'); cookie.hidden = true; });
  $('#cookie-deny').addEventListener('click', () => { store.set('cookies', 'essential'); cookie.hidden = true; });

  /* ---------- FOOTER ACCORDION (mobile) ---------- */
  $$('.footer__col h4').forEach(h => {
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    const toggle = () => { if (window.matchMedia('(max-width: 680px)').matches) h.parentElement.classList.toggle('is-open'); };
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* ---------- TOASTS ---------- */
  let toastTimer;
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 300); }, 2400);
  }
  function bump(el) { if (!el) return; el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'ease' }); }

  /* ---------- FLY TO CART ---------- */
  function flyToCart(imgEl) {
    try {
      const cartBtn = $('#cart-btn');
      if (!imgEl || !cartBtn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (document.documentElement.getAttribute('data-perf') === 'lite') return;
      const s = imgEl.getBoundingClientRect(), t = cartBtn.getBoundingClientRect();
      const fly = document.createElement('img');
      fly.src = imgEl.currentSrc || imgEl.src; fly.className = 'fly';
      fly.style.cssText = `left:${s.left}px;top:${s.top}px;width:${s.width}px;height:${s.height}px;opacity:1`;
      document.body.appendChild(fly);
      requestAnimationFrame(() => {
        fly.style.left = (t.left + t.width / 2 - 14) + 'px';
        fly.style.top = (t.top + t.height / 2 - 14) + 'px';
        fly.style.width = '28px'; fly.style.height = '28px';
        fly.style.opacity = '0.15'; fly.style.transform = 'rotate(35deg)';
      });
      setTimeout(() => fly.remove(), 950);
    } catch (e) {}
  }

  /* ---------- REVEAL ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents, o) => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); o.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  $$('[data-reveal]').forEach(el => io ? io.observe(el) : el.classList.add('is-in'));

  /* ---------- MAP (Leaflet · real pins · lazy) ---------- */
  (function () {
    const el = $('#map'); if (!el || !window.L) return;
    let made = false;
    const make = () => {
      if (made) return; made = true;
      try {
        const map = L.map(el, { scrollWheelZoom: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(map);
        const icon = L.divIcon({ className: 'lk-pin', html: '🍦', iconSize: [30, 30], iconAnchor: [15, 28], popupAnchor: [0, -26] });
        const spots = [
          [59.331, 18.064, 'Stockholm', 'Götgatan 12 · Öppet 11–21'],
          [57.700, 11.968, 'Göteborg', 'Magasinsgatan 4 · Öppet 11–21'],
          [55.605, 13.000, 'Malmö', 'Lilla Torg 7 · Öppet 11–20'],
          [58.944, 17.490, 'Sörmland (gården)', 'Lyckhem, Vagnhärad · Helger 10–17']
        ];
        const pts = spots.map(s => { L.marker([s[0], s[1]], { icon }).addTo(map).bindPopup(`<b>${s[2]}</b>${s[3]}`); return [s[0], s[1]]; });
        map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
        setTimeout(() => map.invalidateSize(), 250);
      } catch (e) {}
    };
    setTimeout(make, 50);
  })();

  /* ---------- EFFECT LEVEL (Lite / Standard / Full) ---------- */
  let lenisInst = null, lenisRAF = 0;
  function setLenis(on) {
    if (on && !lenisInst && window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        lenisInst = new Lenis({ duration: 1.05, smoothWheel: true });
        const raf = t => { if (lenisInst) { lenisInst.raf(t); lenisRAF = requestAnimationFrame(raf); } };
        lenisRAF = requestAnimationFrame(raf);
      } catch (e) {}
    } else if (!on && lenisInst) {
      try { lenisInst.destroy(); } catch (e) {}
      lenisInst = null; if (lenisRAF) cancelAnimationFrame(lenisRAF);
    }
  }
  function applyPerf(mode, save) {
    document.documentElement.setAttribute('data-perf', mode);
    if (save !== false) { try { localStorage.setItem('lyckokulan:perfMode', mode); } catch (e) {} }
    $$('[data-perf-set]').forEach(b => b.classList.toggle('is-active', b.dataset.perfSet === mode));
    setLenis(mode === 'full');
  }
  $$('[data-perf-set]').forEach(b => b.addEventListener('click', () => { applyPerf(b.dataset.perfSet); toast('Effektnivå: ' + b.textContent); }));
  applyPerf(document.documentElement.getAttribute('data-perf') || 'full', false);

  /* ---------- FPS GUARD — auto-downgrade full→standard on weak GPUs (only if user hasn't chosen) ---------- */
  (function () {
    let chosen = null; try { chosen = localStorage.getItem('lyckokulan:perfMode'); } catch (e) {}
    if (chosen === 'full' || chosen === 'standard' || chosen === 'lite') return;
    if (document.documentElement.getAttribute('data-perf') !== 'full') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTimeout(() => {
      let frames = 0; const start = performance.now();
      (function tick(now) {
        frames++;
        if (now - start < 2200) requestAnimationFrame(tick);
        else if ((frames * 1000 / (now - start)) < 45) { applyPerf('standard'); toast('🍦 Sänkte effektnivån för mjukare scroll – ändra längst ner'); }
      })(performance.now());
    }, 1400);
  })();

  /* ---------- INIT ---------- */
  renderGrid();
  renderCart();
  renderWish();
  updateCounts();
})();
