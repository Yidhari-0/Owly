/* =========================================================
   progress.js — menyimpan & menampilkan kemajuan belajar
   Semua data disimpan di BROWSER perangkat ini (localStorage),
   tidak dikirim ke server mana pun. Data tidak ikut pindah ke
   perangkat lain atau browser lain.

   Yang disimpan:
   - hasil jawaban tiap soal di Bank Soal (benar / salah, berapa kali)
   - waktu belajar per hari (dihitung saat halaman terbuka & aktif)
   - profil (nama, sekolah, target mingguan, dll.)

   Halaman memakai atribut data-* untuk menampilkan angka, mis.
   <b data-stat="attempted"></b>. Lihat fungsi renderAll() di bawah.
   ========================================================= */
(function () {
  'use strict';

  const KEY = 'owly-progress-v1';
  const SOAL = window.SOAL || [];
  const TOPICS = window.TOPICS || { mtk: [], ind: [] };
  const SUBJ = { mtk: 'Matematika', ind: 'Bahasa Indonesia' };
  const DAY_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const DAY_INIT = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  const MONTH = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const MONTH_S = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  /* Nilai awal profil (contoh) sampai kamu mengubahnya di halaman Profile */
  const DEFAULT_PROFILE = { name: 'Nara Aditya', nick: 'Nara', school: 'SMP Negeri 1 Bandung', grade: 'SMP · Kelas 9', target: '120 menit / minggu' };
  /* Kolom di halaman Profile: id input -> nama field */
  const FIELDS = { f1: 'name', f2: 'nick', f3: 'email', f4: 'phone', f5: 'school', f6: 'grade', f7: 'city', f8: 'year', f9: 'target', f10: 'fav' };

  const $ = id => document.getElementById(id);
  const byId = id => SOAL.find(q => q.id === id);
  const pad = n => String(n).padStart(2, '0');
  const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const todayKey = () => dkey(new Date());
  const sum = a => a.reduce((x, y) => x + y, 0);

  /* ---------- Penyimpanan (selalu baca-ubah-tulis, aman bila ada beberapa tab) ---------- */
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && d.v === 1) return d;
    } catch (e) { /* abaikan */ }
    return { v: 1, answers: {}, days: {}, log: [], last: null, profile: {} };
  }
  function mutate(fn) {
    const d = load();
    fn(d);
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* penyimpanan penuh / diblokir */ }
    return d;
  }

  /* ---------- Perhitungan ---------- */
  function weekDays(offset) {
    const n = new Date();
    const dow = (n.getDay() + 6) % 7;                       // Senin = 0
    const start = new Date(n.getFullYear(), n.getMonth(), n.getDate() - dow + offset * 7);
    return [0, 1, 2, 3, 4, 5, 6].map(i => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return { date: d, key: dkey(d) };
    });
  }
  const fmtTime = m => (m >= 60 ? Math.floor(m / 60) + ' j ' + (m % 60) + ' m' : m + ' m');
  const timeHtml = m => m >= 60
    ? '<b>' + Math.floor(m / 60) + '</b><span> j </span><b>' + (m % 60) + '</b><span> m</span>'
    : '<b>' + m + '</b><span> m</span>';

  function compute(db) {
    const days = db.days;
    const minOf = k => Math.round(((days[k] || {}).sec || 0) / 60);
    const triesOf = k => (days[k] || {}).tries || 0;
    const active = k => !!days[k] && (days[k].tries > 0 || days[k].sec >= 60);

    let tries = 0, ok = 0;
    Object.values(days).forEach(d => { tries += d.tries || 0; ok += d.ok || 0; });
    const attempted = Object.keys(db.answers).filter(id => byId(id)).length;

    const wk = weekDays(0), pw = weekDays(-1);
    const weekMins = wk.map(d => minOf(d.key));
    const weekTotal = sum(weekMins), prevTotal = sum(pw.map(d => minOf(d.key)));
    const weekTries = sum(wk.map(d => triesOf(d.key)));
    const activeDays = wk.filter(d => active(d.key)).length;

    /* Penguasaan: sebuah soal "dikuasai" jika pernah dijawab benar */
    const babs = [];
    ['mtk', 'ind'].forEach(s => TOPICS[s].forEach(b => {
      const qs = SOAL.filter(q => q.subject === s && q.bab === b);
      const done = qs.filter(q => db.answers[q.id] && db.answers[q.id].best).length;
      const tried = qs.filter(q => db.answers[q.id]).length;
      babs.push({ subject: s, bab: b, total: qs.length, done, tried, complete: qs.length > 0 && done === qs.length });
    }));
    const subj = {};
    ['mtk', 'ind'].forEach(s => {
      const b = babs.filter(x => x.subject === s);
      const total = sum(b.map(x => x.total)), done = sum(b.map(x => x.done));
      subj[s] = { total, done, pct: total ? Math.round(done / total * 100) : 0, babDone: b.filter(x => x.complete).length, babTotal: b.length };
    });
    const babDone = babs.filter(b => b.complete).length;

    /* Streak: hari berturut-turut yang ada aktivitas (soal dijawab atau belajar ≥ 1 menit) */
    let streak = 0;
    const cur = new Date();
    if (!active(dkey(cur))) cur.setDate(cur.getDate() - 1);
    while (active(dkey(cur))) { streak++; cur.setDate(cur.getDate() - 1); }

    const P = Object.assign({}, DEFAULT_PROFILE, db.profile);
    const target = parseInt(String(P.target).replace(/\D/g, ''), 10) || 120;
    const tk = todayKey();

    return { db, P, tries, ok, attempted, wk, weekMins, weekTotal, prevTotal, weekTries, activeDays, babs, subj, babDone,
      babTotal: babs.length, streak, target, minOf, active, todayMin: minOf(tk), todayTries: triesOf(tk),
      accuracy: tries ? Math.round(ok / tries * 100) : 0 };
  }

  /* Bab yang paling pas dilanjutkan */
  function resumeBab(S) {
    const last = S.db.last && byId(S.db.last);
    if (last) {
      const b = S.babs.find(x => x.subject === last.subject && x.bab === last.bab);
      if (b && !b.complete) return b;
    }
    return S.babs.find(b => b.tried > 0 && !b.complete) || S.babs.find(b => !b.complete) || S.babs[0];
  }
  function nextQuestion(S, b) {
    const qs = SOAL.filter(q => q.subject === b.subject && q.bab === b.bab);
    return qs.find(q => !(S.db.answers[q.id] && S.db.answers[q.id].best)) || qs[0];
  }

  /* ---------- Menampilkan ---------- */
  const setAll = (sel, fn) => document.querySelectorAll(sel).forEach(fn);
  const text = (sel, v) => setAll(sel, e => (e.textContent = v));

  function renderAll() {
    const S = compute(load());
    const { P } = S;
    const wk = S.wk;

    /* Identitas & sapaan */
    const nick = (P.nick || P.name.split(' ')[0] || 'Kamu').trim();
    const initials = P.name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'NA';
    const h = new Date().getHours();
    const greet = h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
    const kelas = /kelas\s*(\d+)/i.exec(P.grade);
    text('[data-nick]', nick);
    text('[data-fullname]', P.name);
    text('[data-initials]', initials);
    text('[data-greet]', greet);
    text('[data-grade]', P.grade);
    text('[data-gradeshort]', kelas ? 'Siswa kelas ' + kelas[1] : 'Siswa');
    text('[data-idline]', P.grade + '  |  ' + P.school);

    /* Streak */
    text('[data-streak]', S.streak > 0 ? '🔥  ' + S.streak + ' hari berturut-turut' : '🌱  Mulai streak-mu hari ini');

    /* Label pekan */
    const a = wk[0].date, z = wk[6].date;
    const label = a.getMonth() === z.getMonth()
      ? a.getDate() + '–' + z.getDate() + ' ' + MONTH_S[z.getMonth()]
      : a.getDate() + ' ' + MONTH_S[a.getMonth()] + '–' + z.getDate() + ' ' + MONTH_S[z.getMonth()];
    text('[data-weeklabel]', label);

    /* Angka ringkasan */
    const diff = S.weekTotal - S.prevTotal;
    const targetPct = Math.min(100, Math.round(S.weekTotal / S.target * 100));
    const remain = Math.max(0, S.target - S.weekTotal);
    const stat = {
      attempted: S.attempted,
      attemptedLabel: S.attempted + ' soal',
      weekTriesNote: S.weekTries > 0 ? '+' + S.weekTries + ' percobaan minggu ini' : 'Belum ada latihan minggu ini',
      accuracy: S.tries ? S.accuracy + '%' : '–',
      accuracyNum: S.tries ? S.accuracy : 0,
      accuracyNote: S.tries ? 'Dari ' + S.tries + ' percobaan' : 'Kerjakan soal untuk melihat akurasimu',
      weekTime: fmtTime(S.weekTotal),
      diffShort: S.prevTotal === 0 && S.weekTotal === 0 ? '' : (diff >= 0 ? '↗ +' : '↘ −') + Math.abs(diff) + ' m',
      diffLong: S.prevTotal === 0 && S.weekTotal === 0 ? 'Mulai belajar untuk mengisi grafik'
        : diff === 0 ? 'Sama seperti minggu lalu'
        : (diff > 0 ? '↗ +' : '↘ −') + Math.abs(diff) + ' menit dari minggu lalu',
      timeNote: S.weekTotal > 0 ? 'Langkah kecil, dampak besar.' : 'Waktu belajar dihitung saat halaman terbuka.',
      targetText: S.weekTotal + ' / ' + S.target + ' menit',
      targetPct: targetPct,
      targetPctText: targetPct + '%',
      remainText: remain > 0 ? remain + ' menit lagi menuju targetmu.' : 'Target mingguan tercapai! 🎉',
      babDone: S.babDone, babTotal: S.babTotal,
      babOf: S.babDone + ' / ' + S.babTotal,
      babPct: Math.round(S.babDone / S.babTotal * 100),
      daysNote: S.activeDays > 0 ? S.activeDays + ' hari belajar minggu ini. Satu sesi pendek pun tetap berarti.' : 'Belum ada hari belajar minggu ini. Satu sesi pendek pun sudah berarti.',
      streakTitle: S.streak > 0 ? S.streak + ' hari berturut-turut' : 'Belum ada streak',
      streakSub: S.streak > 0 ? 'Kebiasaan baikmu mulai tumbuh.' : 'Kerjakan satu soal hari ini untuk memulainya.',
      babAccMeta: ''
    };
    setAll('[data-stat]', e => { const v = stat[e.dataset.stat]; if (v !== undefined) e.textContent = v; });
    setAll('[data-bar]', e => { e.style.width = (stat[e.dataset.bar] || 0) + '%'; });
    setAll('[data-html="weekTimeHtml"]', e => { e.innerHTML = timeHtml(S.weekTotal); });

    /* Kartu mata pelajaran (Beranda & Progres) */
    ['mtk', 'ind'].forEach(s => {
      const x = S.subj[s];
      setAll('[data-subj-bar="' + s + '"]', e => { e.style.width = x.pct + '%'; });
      setAll('[data-subj-pct="' + s + '"]', e => { e.textContent = x.pct + '%'; });
      setAll('[data-subj-text="' + s + '"]', e => { e.textContent = x.babDone + ' dari ' + x.babTotal + ' bab selesai'; });
    });

    /* Kartu bab (Materi) */
    setAll('[data-bab]', card => {
      const [s, name] = card.dataset.bab.split('|');
      const b = S.babs.find(x => x.subject === s && x.bab === name);
      if (!b) return;
      const pct = b.total ? Math.round(b.done / b.total * 100) : 0;
      card.querySelector('[data-chbar]').style.width = pct + '%';
      card.querySelector('[data-chleft]').textContent = b.done + ' dari ' + b.total + ' soal dikuasai';
      card.querySelector('[data-chright]').textContent = b.complete ? 'Tuntas' : b.tried ? pct + '%' : 'Belum dimulai';
    });

    /* Kartu "Lanjutkan belajar" & rekomendasi */
    const rb = resumeBab(S), nq = nextQuestion(S, rb);
    const rpct = rb.total ? Math.round(rb.done / rb.total * 100) : 0;
    const link = 'bank-soal.html?q=' + nq.id;
    text('[data-resume-title]', rb.tried ? rb.bab + ', makin paham.' : rb.bab + ', mulai dari sini.');
    text('[data-resume-meta]', SUBJ[rb.subject] + ' · ' + rb.done + ' dari ' + rb.total + ' soal dikuasai');
    text('[data-resume-pct]', rpct + '%');
    setAll('[data-resume-bar]', e => { e.style.width = rpct + '%'; });
    text('[data-resume-eta]', (rb.total - rb.done) + ' soal tersisa');
    setAll('[data-resume-link]', e => { e.href = link; });
    text('[data-rec-title]', 'Biar ' + rb.bab + ' makin melekat.');
    text('[data-rec-text]', (rb.total - rb.done) + ' soal di bab ini belum kamu kuasai. Mulai dari satu soal dulu.');
    setAll('[data-rec-link]', e => { e.href = link; });

    /* Target harian */
    const g1 = S.todayTries >= 5, g2 = S.todayMin >= 15, gc = (g1 ? 1 : 0) + (g2 ? 1 : 0);
    text('[data-goal-title]', gc === 2 ? 'Target hari ini tercapai! 🎉' : gc === 1 ? 'Satu langkah lagi hari ini!' : 'Mulai dari satu langkah kecil.');
    text('[data-goal-text]', gc + ' dari 2 target belajar hari ini selesai (' + S.todayTries + '/5 soal · ' + S.todayMin + '/15 menit).');
    setAll('[data-goal-bar]', e => { e.style.width = Math.round((Math.min(S.todayTries / 5, 1) + Math.min(S.todayMin / 15, 1)) / 2 * 100) + '%'; });

    /* Grafik mingguan di Beranda */
    const hc = $('homeChart');
    if (hc) {
      const axis = Math.max(30, ...S.weekMins);
      hc.innerHTML = wk.map((d, i) => {
        const m = S.weekMins[i];
        const hgt = m > 0 ? Math.max(8, Math.round(m / axis * 80)) : 5;
        const cls = (d.key === todayKey() ? ' is-today' : '') + (m === 0 ? ' is-empty' : '');
        return '<div class="chart__day' + cls + '" title="' + DAY_SHORT[i] + ' ' + d.date.getDate() + ': ' + m + ' menit"><div class="chart__col"><i style="height:' + hgt + 'px"></i></div><span>' + DAY_INIT[i] + '</span></div>';
      }).join('');
    }

    /* Kalender pekan di Beranda */
    const week = $('week');
    if (week) {
      week.querySelectorAll('.day').forEach((btn, i) => {
        if (!wk[i]) return;
        btn.querySelector('b').textContent = wk[i].date.getDate();
        btn.classList.toggle('is-active', wk[i].key === todayKey());
      });
      const now = new Date();
      text('[data-calmonth]', MONTH[now.getMonth()] + ' ' + now.getFullYear());
      text('[data-todaylabel]', 'Hari ini, ' + now.getDate() + ' ' + MONTH[now.getMonth()]);
    }

    /* Grafik batang & sumbu (Progres) */
    const pc = $('plotCols'), py = $('plotY');
    if (pc && py) {
      const maxM = Math.max(0, ...S.weekMins);
      const axisMax = Math.max(20, Math.ceil(maxM / 20) * 20);
      py.innerHTML = [4, 3, 2, 1, 0].map(k => '<span>' + (k === 0 ? '0' : axisMax * k / 4 + ' m') + '</span>').join('');
      pc.innerHTML = wk.map((d, i) => {
        const m = S.weekMins[i];
        const hgt = m > 0 ? Math.max(6, Math.round(m / axisMax * 160)) : 3;
        const cls = (d.key === todayKey() ? ' is-today' : '') + (m === 0 ? ' is-empty' : '');
        return '<div class="plot__col' + cls + '"><div class="plot__bar"><i style="--h:' + hgt + 'px"></i>' + (m > 0 ? '<em>' + m + '</em>' : '') + '</div><span>' + DAY_SHORT[i] + ' ' + d.date.getDate() + '</span></div>';
      }).join('');
    }

    /* Cincin target (Progres) */
    const arc = $('ringArc');
    if (arc) {
      const C = 2 * Math.PI * 62;
      arc.setAttribute('stroke-dasharray', (C * targetPct / 100).toFixed(1) + ' ' + C.toFixed(1));
      arc.style.display = targetPct > 0 ? '' : 'none';   // hindari titik kecil saat 0%
    }

    /* Titik streak 7 hari terakhir (Progres) */
    const sd = $('streakDays');
    if (sd) {
      let html = '';
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const on = S.active(dkey(d));
        html += '<div>' + DAY_INIT[(d.getDay() + 6) % 7] + ' ' + d.getDate() + '<i class="' + (on ? 'on' : '') + '">' + (on ? '<svg class="icon"><use href="#check"/></svg>' : '·') + '</i></div>';
      }
      sd.innerHTML = html;
    }

    /* Lencana (Progres) */
    const badges = {
      first: [S.tries >= 1, 'Soal pertamamu sudah dikerjakan', 'Kerjakan satu soal di Bank soal'],
      streak: [S.streak >= 3, S.streak + ' hari belajar berturut-turut', 'Belajar 3 hari berturut-turut'],
      acc: [S.tries >= 5 && S.accuracy > 75, 'Akurasi latihan di atas 75%', 'Capai akurasi di atas 75% (min. 5 percobaan)']
    };
    setAll('[data-badge]', e => {
      const b = badges[e.dataset.badge];
      e.classList.toggle('is-locked', !b[0]);
      e.querySelector('[data-badge-text]').textContent = b[0] ? b[1] : 'Belum diraih · ' + b[2];
    });

    /* Saran (Progres) */
    const low = S.subj.mtk.pct <= S.subj.ind.pct ? 'mtk' : 'ind';
    text('[data-advice-title]', 'Luangkan sedikit waktu untuk ' + SUBJ[low] + '.');
    text('[data-advice-text]', S.tries === 0 ? 'Mulai dari satu soal. Langkah kecil bisa membuat perbedaan.'
      : 'Kamu sudah menguasai ' + S.subj[low].done + ' dari ' + S.subj[low].total + ' soal. Coba 10 menit latihan hari ini.');
    setAll('[data-advice-link]', e => { e.href = 'bank-soal.html?subject=' + low; });

    /* Riwayat latihan terakhir (Latihan) */
    const hl = $('histList');
    if (hl) {
      const items = S.db.log.filter(x => byId(x.id)).slice(0, 2);
      hl.innerHTML = items.length ? items.map((x, i) => {
        const q = byId(x.id), d = new Date(x.ts);
        const dd = Math.round((new Date(todayKey()) - new Date(dkey(d))) / 86400000);
        const when = dd <= 0 ? 'Hari ini, ' + pad(d.getHours()) + '.' + pad(d.getMinutes()) : dd === 1 ? 'Kemarin' : dd + ' hari lalu';
        return (i ? '<div class="divider"></div>' : '') +
          '<div class="hist__row"><span class="hist__score ' + (x.ok ? 'is-ok' : 'is-no') + '">' + (x.ok ? '✓' : '✗') + '</span>' +
          '<div class="hist__info"><b>' + q.title + '</b><span>' + SUBJ[q.subject] + ' · ' + (x.ok ? 'Benar' : 'Belum tepat') + ' · ' + when + '</span></div>' +
          '<a href="bank-soal.html?q=' + q.id + '" class="btn-act"><span>Pembahasan</span><svg class="icon"><use href="#chev-right"/></svg></a></div>';
      }).join('') : '<p class="empty">Belum ada latihan. Kerjakan soal pertamamu di Bank soal.</p>';
    }

  }

  /* Isian profil: diisi dari data tersimpan SEKALI saat halaman dibuka
     (supaya ketikan yang belum disimpan tidak tertimpa) */
  function restoreProfile() {
    const pf = load().profile || {};
    Object.keys(FIELDS).forEach(id => {
      const el = $(id);
      if (el && pf[FIELDS[id]] !== undefined) el.value = pf[FIELDS[id]];
    });
    const rem = $('remind');
    if (rem && pf.remind !== undefined) rem.checked = !!pf.remind;
  }

  /* ---------- API untuk halaman lain ---------- */
  window.Owly = {
    recordAnswer(id, ok) {
      mutate(d => {
        const a = d.answers[id] || { tries: 0, best: false };
        a.tries++; a.ok = ok; a.best = a.best || ok; a.ts = Date.now();
        d.answers[id] = a;
        const day = d.days[todayKey()] || (d.days[todayKey()] = { sec: 0, tries: 0, ok: 0 });
        day.tries++; if (ok) day.ok++;
        d.log.unshift({ id, ok, ts: Date.now() });
        d.log = d.log.slice(0, 30);
        d.last = id;
      });
      renderAll();
    },
    status(id) {
      const a = load().answers[id];
      return !a ? '' : a.best ? 'ok' : 'retry';
    }
  };

  /* ---------- Profil: simpan & hapus data ---------- */
  document.querySelectorAll('[data-save]').forEach(btn => btn.addEventListener('click', () => {
    mutate(d => {
      Object.keys(FIELDS).forEach(id => { const el = $(id); if (el) d.profile[FIELDS[id]] = el.value.trim(); });
      const rem = $('remind'); if (rem) d.profile.remind = rem.checked;
    });
    renderAll();
  }));
  document.querySelectorAll('[data-reset-progress]').forEach(btn => btn.addEventListener('click', () => {
    if (confirm('Hapus semua data belajar di perangkat ini (jawaban, waktu belajar, profil, dan soal tersimpan)? Ini tidak bisa dibatalkan.')) {
      try { localStorage.removeItem(KEY); localStorage.removeItem('owly-saved-questions'); } catch (e) { /* abaikan */ }
      location.reload();
    }
  }));

  /* ---------- Formulir "Latihan sesuai ritmemu" ---------- */
  const pf = document.querySelector('[data-practice-form]');
  if (pf) {
    const mapel = $('mapel'), topik = $('topik');
    const fill = () => {
      topik.innerHTML = '<option value="">Semua topik</option>' + TOPICS[mapel.value].map(t => '<option value="' + t + '">' + t + '</option>').join('');
    };
    mapel.addEventListener('change', fill);
    fill();
    pf.addEventListener('submit', e => {
      e.preventDefault();
      let url = 'bank-soal.html?subject=' + mapel.value;
      if (topik.value) url += '&topic=' + encodeURIComponent(topik.value);
      location.href = url;
    });
  }

  /* ---------- Waktu belajar: dihitung saat halaman terlihat & ada aktivitas ---------- */
  let lastAct = Date.now(), tick = 0;
  ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(ev =>
    window.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true }));
  setInterval(() => {
    if (document.visibilityState !== 'visible' || Date.now() - lastAct > 60000) return;
    mutate(d => {
      const day = d.days[todayKey()] || (d.days[todayKey()] = { sec: 0, tries: 0, ok: 0 });
      day.sec += 5;
    });
    if (++tick % 6 === 0) renderAll();     // segarkan angka tiap ±30 detik
  }, 5000);

  /* Perubahan dari tab lain */
  window.addEventListener('storage', e => { if (e.key === KEY) renderAll(); });

  restoreProfile();
  renderAll();
})();
