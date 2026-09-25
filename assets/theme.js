const root = window.Shopify?.routes?.root || '/';

// Header turns solid once the page scrolls (only visible on the homepage overlay)
const header = document.querySelector('.section-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

// Search panel: focus the field when opened
document.querySelectorAll('details.search').forEach((d) =>
  d.addEventListener('toggle', () => d.open && d.querySelector('input')?.focus())
);

// Announcement dismiss (remembered for the session)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-dismiss-announcement]');
  if (!btn) return;
  btn.closest('.announcement').remove();
  try { sessionStorage.setItem('enzo-announcement', 'off'); } catch {}
});

/* ---------- Cart drawer ---------- */
const drawer = () => document.getElementById('cart-drawer');

function renderCart(html) {
  const next = new DOMParser().parseFromString(html, 'text/html').getElementById('cart-drawer');
  drawer().innerHTML = next.innerHTML;
  document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = next.dataset.count));
}

async function cartRequest(path, body) {
  const res = await fetch(root + path, { method: 'POST', headers: { Accept: 'application/json' }, body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || data.message || 'Something went wrong');
  renderCart(data.sections['cart-drawer']);
}

document.addEventListener('click', async (e) => {
  const d = drawer();
  if (!d) return;
  if (e.target.closest('[data-cart-open]')) { e.preventDefault(); d.showModal(); return; }
  if (e.target.closest('[data-cart-close]') || e.target === d) { d.close(); return; }

  // +/- and remove links fall back to /cart/change without JS
  const change = e.target.closest('[data-line]');
  if (change && d.contains(change)) {
    e.preventDefault();
    const body = new FormData();
    body.append('line', change.dataset.line);
    body.append('quantity', change.dataset.quantity);
    body.append('sections', 'cart-drawer');
    try { await cartRequest('cart/change.js', body); } catch { location.href = change.href; }
  }
});

document.addEventListener('submit', async (e) => {
  const form = e.target;
  if (!form.matches('form[action*="/cart/add"]') || !drawer()) return;
  e.preventDefault();
  const btn = form.querySelector('[type="submit"]');
  const error = form.querySelector('[data-form-error]');
  const body = new FormData(form);
  body.append('sections', 'cart-drawer');
  btn?.setAttribute('aria-busy', 'true');
  if (error) error.hidden = true;
  try {
    await cartRequest('cart/add.js', body);
    drawer().showModal();
  } catch (err) {
    if (error) { error.textContent = err.message; error.hidden = false; } else alert(err.message);
  } finally {
    btn?.removeAttribute('aria-busy');
  }
});

/* ---------- Variant picker ---------- */
document.querySelectorAll('[data-product]').forEach((product) => {
  const picker = product.querySelector('[data-variant-picker]');
  if (!picker) return;
  const variants = JSON.parse(product.querySelector('[data-variants]').textContent);
  const idInput = product.querySelector('form input[name="id"]');
  const price = product.querySelector('[data-price]');
  const btn = product.querySelector('[data-add]');

  picker.addEventListener('change', () => {
    const selected = [...picker.querySelectorAll('fieldset')].map((f) => f.querySelector(':checked')?.value);
    const variant = variants.find((v) => v.options.every((o, i) => o === selected[i]));
    btn.disabled = !variant?.available;
    btn.textContent = !variant ? 'Unavailable' : variant.available ? btn.dataset.label : 'Sold out';
    if (!variant) return;
    idInput.value = variant.id;
    price.innerHTML = variant.price + (variant.compare ? ` <s>${variant.compare}</s>` : '');
    history.replaceState(null, '', `?variant=${variant.id}`);
  });
});
