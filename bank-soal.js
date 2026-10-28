/* =========================================================
   bank-soal.js — logika halaman Bank Soal
   (daftar soal, filter, pencarian, pratinjau, periksa jawaban, simpan soal)
   Data soal ada di soal.js
   ========================================================= */
(function () {
  'use strict';

  const SOAL = window.SOAL, TOPICS = window.TOPICS;
  const PAGE_SIZE = 6;
  const TYPE_LABEL = { pg: 'Pilihan ganda', multi: 'Pilihan ganda kompleks', table: 'Tabel pernyataan' };
  const HINT = {
    pg: 'Pilih satu jawaban yang paling tepat.',
    multi: 'Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.',
    table: 'Tentukan jawaban untuk setiap pernyataan.'
  };
  const SUBJECT_NAME = { mtk: 'Matematika', ind: 'Bahasa Indonesia' };
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];

  const $ = id => document.getElementById(id);
  const icon = name => '<svg class="icon"><use href="#' + name + '"/></svg>';
  const plain = html => html.replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  /* ---------- Soal tersimpan (disimpan di browser) ---------- */
  const KEY = 'owly-saved-questions';
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { /* abaikan */ }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify([...saved])); } catch (e) { /* abaikan */ } }

  /* ---------- Status halaman ---------- */
  const state = { subject: 'mtk', savedOnly: false, topic: '', level: '', type: '', search: '', page: 1, selected: SOAL[0].id };
  const byId = id => SOAL.find(q => q.id === id);
  const searchText = q => plain(q.title + ' ' + q.bab + ' ' + q.stimulus + ' ' + q.question).toLowerCase();

  function filtered() {
    const s = state.search.trim().toLowerCase();
    return SOAL.filter(q =>
      q.subject === state.subject &&
      (!state.savedOnly || saved.has(q.id)) &&
      (!state.topic || q.bab === state.topic) &&
      (!state.level || q.level === state.level) &&
      (!state.type || q.type === state.type) &&
      (!s || searchText(q).includes(s))
    );
  }

  /* ---------- Ringkasan koleksi ---------- */
  function renderSummary() {
    const m = SOAL.filter(q => q.subject === 'mtk').length;
    const i = SOAL.filter(q => q.subject === 'ind').length;
    $('cTotal').textContent = SOAL.length + ' soal';
    $('cMtk').textContent = m;
    $('cInd').textContent = i;
    $('savedBtn').querySelector('span').textContent = 'Soal tersimpan · ' + String(saved.size).padStart(2, '0');
    $('savedPill').textContent = 'Tersimpan · ' + saved.size;
  }

  function renderTopics() {
    const sel = $('qTopic');
    sel.innerHTML = '<option value="">Semua topik</option>' +
      TOPICS[state.subject].map(t => '<option value="' + t + '">' + t + '</option>').join('');
    sel.value = state.topic;
  }

  /* ---------- Daftar soal ---------- */
  function renderList() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * PAGE_SIZE;
    const slice = list.slice(start, start + PAGE_SIZE);

    $('qCount').textContent = list.length + (state.savedOnly ? ' soal tersimpan' : ' soal ' + SUBJECT_NAME[state.subject]);
    $('qRange').textContent = list.length ? 'Halaman ' + state.page + ' dari ' + pages : '';

    if (!list.length) {
      $('qList').innerHTML = '<p class="empty">Belum ada soal yang cocok. Coba ubah filter atau kata kunci.</p>';
    } else {
      $('qList').innerHTML = slice.map(q => {
        const sel = q.id === state.selected ? ' is-selected' : '';
        const sv = saved.has(q.id) ? ' is-saved' : '';
        const amber = q.level === 'Menantang' ? ' chip--amber' : '';
        return '<article class="qrow' + sel + '" data-id="' + q.id + '" tabindex="0" role="button" aria-label="Buka soal ' + q.id + '">' +
          '<div class="qrow__meta"><span><b>' + q.id + '</b><i>·</i>' + q.bab + '</span>' +
          '<button class="bm' + sv + '" data-bm="' + q.id + '" aria-label="Simpan soal">' + icon('bookmark') + '</button></div>' +
          '<h4>' + q.title + '</h4>' +
          '<p>' + plain(q.stimulus || q.question) + '</p>' +
          '<div class="qrow__foot"><span>' + TYPE_LABEL[q.type] + '</span><span class="chip' + amber + '">' + q.level + '</span></div>' +
          '</article>';
      }).join('');
    }

    /* Penomoran halaman */
    const from = list.length ? start + 1 : 0, to = Math.min(start + PAGE_SIZE, list.length);
    $('pagerInfo').textContent = list.length ? from + '–' + to + ' dari ' + list.length + ' soal' : '';
    let nums = '';
    if (pages > 1) {
      nums += '<button class="btn-act" type="button" data-page="' + (state.page - 1) + '" aria-label="Sebelumnya"' + (state.page === 1 ? ' disabled' : '') + '>' + icon('chev-left') + '</button>';
      for (let p = 1; p <= pages; p++) nums += '<button class="pill' + (p === state.page ? ' is-active' : '') + '" type="button" data-page="' + p + '">' + p + '</button>';
      nums += '<button class="btn-act" type="button" data-page="' + (state.page + 1) + '" aria-label="Berikutnya"' + (state.page === pages ? ' disabled' : '') + '>' + icon('chev-right') + '</button>';
    }
    $('pagerNums').innerHTML = nums;

    /* Pastikan soal yang dipilih ada di daftar */
    if (!list.some(q => q.id === state.selected)) {
      state.selected = list.length ? list[0].id : null;
      renderPreview();
    }
  }

  /* ---------- Pratinjau soal & jawaban ---------- */
  let pick = null;          // jawaban pg (nomor) atau multi (Set)
  let checked = false;

  function renderPreview() {
    const box = $('preview');
    const q = state.selected ? byId(state.selected) : null;
    checked = false;
    if (!q) {
      box.innerHTML = '<h3>Pratinjau soal</h3><div class="preview__card"><p class="empty">Pilih soal dari daftar untuk melihat pratinjau.</p></div>';
      return;
    }
    pick = q.type === 'multi' ? new Set() : null;

    let answer = '';
    if (q.type === 'table') {
      answer = '<table class="tbl"><thead><tr><th>Pernyataan</th><th>' + q.cols[0] + '</th><th>' + q.cols[1] + '</th></tr></thead><tbody>' +
        q.rows.map((r, i) =>
          '<tr data-row="' + i + '"><td>' + r.t + '</td>' +
          '<td class="c"><input type="radio" name="r' + i + '" value="0" aria-label="' + q.cols[0] + '"></td>' +
          '<td class="c"><input type="radio" name="r' + i + '" value="1" aria-label="' + q.cols[1] + '"></td></tr>'
        ).join('') + '</tbody></table>';
    } else {
      answer = '<div class="opts">' + q.options.map((o, i) =>
        '<button type="button" class="opt" data-i="' + i + '"><b>' + LETTERS[i] + '</b><span>' + o + '</span></button>'
      ).join('') + '</div>';
    }

    box.innerHTML =
      '<h3>Pratinjau soal</h3>' +
      '<div class="preview__card">' +
        '<div class="preview__top"><span class="chip">' + q.bab + '</span>' +
        '<button class="bm' + (saved.has(q.id) ? ' is-saved' : '') + '" id="pvBm" aria-label="Simpan soal">' + icon('bookmark') + '</button></div>' +
        '<span class="preview__id">' + q.id + ' · ' + TYPE_LABEL[q.type] + ' · ' + q.level + '</span>' +
        '<h4>' + q.title + '</h4>' +
        (q.stimulus ? '<div class="stim">' + q.stimulus + '</div>' : '') +
        '<p class="preview__q">' + q.question + '</p>' +
        '<p class="preview__hint">' + HINT[q.type] + '</p>' +
        '<div id="answerBox">' + answer + '</div>' +
        '<div id="result" aria-live="polite"></div>' +
        '<div class="divider"></div>' +
        '<button class="btn-act btn-act--red" id="checkBtn" type="button"><span>Periksa jawaban</span>' + icon('check') + '</button>' +
      '</div>' +
      '<div class="note-box" style="margin-top:18px">' + icon('info') + '<span>Soal latihan bergaya TKA untuk belajar mandiri, bukan soal resmi.</span></div>';
  }

  function checkAnswer() {
    const q = byId(state.selected);
    const res = $('result');
    let ok = false;

    if (q.type === 'pg') {
      if (pick === null) return warn('Pilih satu jawaban dulu ya.');
      ok = pick === q.answer;
      document.querySelectorAll('#answerBox .opt').forEach((b, i) => {
        if (i === q.answer) b.classList.add('is-correct');
        else if (i === pick) b.classList.add('is-wrong');
        b.disabled = true;
      });
    } else if (q.type === 'multi') {
      if (!pick.size) return warn('Pilih minimal satu jawaban dulu ya.');
      ok = q.answer.length === pick.size && q.answer.every(i => pick.has(i));
      document.querySelectorAll('#answerBox .opt').forEach((b, i) => {
        const correct = q.answer.includes(i);
        if (correct) b.classList.add('is-correct');
        else if (pick.has(i)) b.classList.add('is-wrong');
        b.disabled = true;
      });
    } else {
      const vals = q.rows.map((r, i) => {
        const c = document.querySelector('#answerBox input[name="r' + i + '"]:checked');
        return c ? Number(c.value) : null;
      });
      if (vals.includes(null)) return warn('Jawab semua pernyataan dulu ya.');
      ok = vals.every((v, i) => v === q.rows[i].a);
      q.rows.forEach((r, i) => {
        document.querySelector('#answerBox tr[data-row="' + i + '"]').classList.add(vals[i] === r.a ? 'is-correct' : 'is-wrong');
      });
      document.querySelectorAll('#answerBox input').forEach(inp => (inp.disabled = true));
    }

    let key = '';
    if (q.type === 'pg') key = 'Jawaban benar: ' + LETTERS[q.answer] + '. ';
    if (q.type === 'multi') key = 'Jawaban benar: ' + q.answer.map(i => LETTERS[i]).join(', ') + '. ';
    if (q.type === 'table') key = 'Jawaban benar: ' + q.rows.map((r, i) => (i + 1) + ' = ' + q.cols[r.a]).join('; ') + '. ';

    res.innerHTML = '<div class="result ' + (ok ? 'is-ok' : 'is-no') + '">' +
      '<b>' + (ok ? 'Jawabanmu tepat! 🎉' : 'Belum tepat. Tidak apa-apa, pelajari pembahasannya.') + '</b>' +
      '<span>' + (ok ? '' : key) + '<i>Pembahasan:</i> ' + q.explain + '</span></div>';
    checked = true;
    $('checkBtn').querySelector('span').textContent = 'Coba lagi';
  }

  function warn(msg) {
    $('result').innerHTML = '<div class="result is-no"><b>' + msg + '</b></div>';
  }

  /* ---------- Simpan / hapus dari tersimpan ---------- */
  function toggleSave(id) {
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    persist();
    renderSummary();
    renderList();
    const pv = $('pvBm');
    if (pv && state.selected === id) pv.classList.toggle('is-saved', saved.has(id));
  }

  function select(id, scroll) {
    state.selected = id;
    renderList();
    renderPreview();
    if (scroll && window.innerWidth <= 1180) $('preview').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Event ---------- */
  $('qList').addEventListener('click', e => {
    const bm = e.target.closest('[data-bm]');
    if (bm) { e.stopPropagation(); toggleSave(bm.dataset.bm); return; }
    const row = e.target.closest('.qrow');
    if (row) select(row.dataset.id, true);
  });
  $('qList').addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('qrow')) {
      e.preventDefault();
      select(e.target.dataset.id, true);
    }
  });

  $('preview').addEventListener('click', e => {
    if (e.target.closest('#pvBm')) { toggleSave(state.selected); return; }
    if (e.target.closest('#checkBtn')) { checked ? renderPreview() : checkAnswer(); return; }
    const opt = e.target.closest('.opt');
    if (opt && !checked) {
      const i = Number(opt.dataset.i);
      const q = byId(state.selected);
      if (q.type === 'pg') {
        pick = i;
        document.querySelectorAll('#answerBox .opt').forEach(b => b.classList.toggle('is-selected', Number(b.dataset.i) === i));
      } else {
        if (pick.has(i)) pick.delete(i); else pick.add(i);
        opt.classList.toggle('is-selected', pick.has(i));
      }
    }
  });

  $('subjectPills').addEventListener('click', e => {
    const b = e.target.closest('[data-subject-btn]');
    if (!b) return;
    state.subject = b.dataset.subjectBtn; state.topic = ''; state.page = 1;
    document.querySelectorAll('#subjectPills .pill').forEach(x => x.classList.toggle('is-active', x === b));
    renderTopics(); renderList();
  });

  function setSavedOnly(v) {
    state.savedOnly = v; state.page = 1;
    document.querySelectorAll('#savedPills .pill').forEach(x => x.classList.toggle('is-active', (x.dataset.savedBtn === 'saved') === v));
    renderList();
  }
  $('savedPills').addEventListener('click', e => {
    const b = e.target.closest('[data-saved-btn]');
    if (b) setSavedOnly(b.dataset.savedBtn === 'saved');
  });
  $('savedBtn').addEventListener('click', () => setSavedOnly(true));

  $('qSearch').addEventListener('input', e => { state.search = e.target.value; state.page = 1; renderList(); });
  $('qTopic').addEventListener('change', e => { state.topic = e.target.value; state.page = 1; renderList(); });
  $('qLevel').addEventListener('change', e => { state.level = e.target.value; state.page = 1; renderList(); });
  $('qType').addEventListener('change', e => { state.type = e.target.value; state.page = 1; renderList(); });
  $('qReset').addEventListener('click', () => {
    state.topic = state.level = state.type = state.search = ''; state.page = 1;
    $('qSearch').value = ''; $('qLevel').value = ''; $('qType').value = '';
    renderTopics(); setSavedOnly(false);
  });

  $('pagerNums').addEventListener('click', e => {
    const b = e.target.closest('[data-page]');
    if (b && !b.disabled) { state.page = Number(b.dataset.page); renderList(); }
  });

  /* ---------- Mulai ---------- */
  renderSummary();
  renderTopics();
  renderList();
  renderPreview();
})();
