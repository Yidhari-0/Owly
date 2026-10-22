// script.js — interaksi sederhana (vanilla JS, tanpa library)

const sidebar   = document.getElementById('sidebar');
const toggleBtn = document.getElementById('menuToggle');
const backdrop  = document.getElementById('backdrop');

// 1) Buka / tutup sidebar di HP
function setMenu(open) {
  sidebar.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  toggleBtn.setAttribute('aria-expanded', open);
}
toggleBtn.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
backdrop.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// 2) Pintasan Ctrl/⌘ + K untuk fokus ke kolom pencarian
const searchInput = document.getElementById('searchInput');
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
});

// 3) Pilih tanggal di kalender pekan
const days = document.querySelectorAll('#week .day');
days.forEach(day => {
  day.addEventListener('click', () => {
    days.forEach(d => d.classList.remove('is-active'));
    day.classList.add('is-active');
  });
});
