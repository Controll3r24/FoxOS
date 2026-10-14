(() => {
  const $ = (s) => document.querySelector(s);
  const nav = $('#nav'), bar = $('#bar'), bg = $('#heroBg');
  const root = document.documentElement;

  const onScroll = () => {
    bar.style.transform = `scaleX(${scrollY / Math.max(1, root.scrollHeight - innerHeight)})`;
    nav.classList.toggle('solid', scrollY > 24);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#burger').addEventListener('click', () => nav.classList.toggle('open'));
  nav.addEventListener('click', (e) => { if (e.target.closest('ul a')) nav.classList.remove('open'); });

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach((el) => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = Math.min(i * 80, 400) + 'ms';
    io.observe(el);
  });

  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.stat,.card,.app');
    if (c) {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    }
    if (scrollY < innerHeight) {
      bg.style.setProperty('--px', ((e.clientX / innerWidth - 0.5) * -26) + 'px');
      bg.style.setProperty('--py', ((e.clientY / innerHeight - 0.5) * -18) + 'px');
    }
  });

  const btn = $('#dl'), note = $('#dlNote');
  const soon = () => {
    btn.textContent = 'Coming soon';
    btn.removeAttribute('href');
    note.textContent = 'The ISO is on its way. Check back shortly.';
  };
  fetch(btn.dataset.src, { method: 'HEAD', cache: 'no-store' })
    .then((r) => {
      const type = r.headers.get('content-type') || '';
      if (!r.ok || type.includes('html')) return soon();
      const size = +r.headers.get('content-length');
      btn.textContent = 'Download FoxOS';
      btn.removeAttribute('aria-disabled');
      if (size) note.textContent = (size / 1e9 >= 1 ? (size / 1e9).toFixed(2) + ' GB' : (size / 1e6).toFixed(0) + ' MB') + ' \u00b7 x86_64';
    })
    .catch(soon);
})();
