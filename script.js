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


/* =========================================================
   INTERAKSI HALAMAN LAIN
   ========================================================= */

// 4) Filter kategori (Materi, Latihan, Bank Soal)
//    Tombol:  <button data-filter="matematika">   di dalam  <div data-filter-group>
//    Item:    <div data-subject="matematika">     di dalam  elemen ber-atribut data-filter-scope
document.querySelectorAll('[data-filter-group]').forEach(group => {
  const scope = document.querySelector('[data-filter-scope]');
  group.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      scope.querySelectorAll('[data-subject]').forEach(item => {
        item.hidden = !(f === 'all' || item.dataset.subject === f);
      });
    });
  });
});

// 5) Pencarian teks: <input data-search> menyaring item [data-subject] berdasarkan isi teksnya
const searchBox = document.querySelector('[data-search]');
if (searchBox) {
  searchBox.addEventListener('input', () => {
    const q = searchBox.value.trim().toLowerCase();
    document.querySelectorAll('[data-filter-scope] [data-subject]').forEach(item => {
      item.dataset.hiddenBySearch = q && !item.textContent.toLowerCase().includes(q) ? '1' : '';
      item.style.display = item.dataset.hiddenBySearch ? 'none' : '';
    });
  });
}

// 6) Pilihan tunggal (mis. jumlah soal 5 / 10 / 20): <div data-single> berisi beberapa .pill
document.querySelectorAll('[data-single]').forEach(group => {
  group.querySelectorAll('.pill').forEach(p => p.addEventListener('click', () => {
    group.querySelectorAll('.pill').forEach(x => x.classList.remove('is-active'));
    p.classList.add('is-active');
  }));
});

// 7) Bookmark / simpan soal atau bab
document.querySelectorAll('.bm').forEach(b =>
  b.addEventListener('click', () => b.classList.toggle('is-saved'))
);

// 8) Pilihan jawaban di pratinjau soal
document.querySelectorAll('.opts').forEach(list => {
  list.querySelectorAll('.opt').forEach(o => o.addEventListener('click', () => {
    list.querySelectorAll('.opt').forEach(x => x.classList.remove('is-selected'));
    o.classList.add('is-selected');
  }));
});

// 9) Tombol simpan (Profile): teks berubah sebentar sebagai umpan balik
document.querySelectorAll('[data-save]').forEach(btn => {
  const label = btn.querySelector('span');
  btn.addEventListener('click', () => {
    const old = label.textContent;
    label.textContent = 'Tersimpan';
    setTimeout(() => (label.textContent = old), 1600);
  });
});

// 10) Reset filter Bank Soal
const resetBtn = document.querySelector('[data-reset]');
if (resetBtn) resetBtn.addEventListener('click', () => {
  document.querySelectorAll('.filters select').forEach(s => (s.selectedIndex = 0));
  const input = document.querySelector('[data-search]');
  if (input) { input.value = ''; input.dispatchEvent(new Event('input')); }
});
