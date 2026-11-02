(function(){
  /* ---- settings: change these when the site goes live ---- */
  var CONTACT_EMAIL = 'syrantis@gmail.com';
  var FORM_ENDPOINT = '';   // e.g. your form handler URL; leave empty to show the copy-and-email step

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile menu ---- */
  var header = document.getElementById('site-header');
  var menuBtn = document.getElementById('menu-btn');
  menuBtn.addEventListener('click', function(){
    var open = header.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  document.querySelectorAll('#site-nav a').forEach(function(a){
    a.addEventListener('click', function(){
      header.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = 'Menu';
    });
  });

  /* ---- hero: attendance register drives the student app ---- */
  // Ananya's semester so far, before period 2 today: 71 attended of 86 held.
  var BASE_ATTENDED = 71, BASE_HELD = 86;
  var list = document.getElementById('reg-list');
  var countEl = document.getElementById('reg-count');
  var saveBtn = document.getElementById('reg-save');
  var ring = document.getElementById('ph-ring');
  var pctEl = document.getElementById('ph-pct');
  var statusEl = document.getElementById('ph-status');
  var p2 = document.getElementById('ph-p2');
  var card = document.getElementById('ph-card');
  var shownPct = 82.8;

  function animatePct(to){
    var from = shownPct; shownPct = to;
    ring.style.setProperty('--pct', to.toFixed(1));
    if (reduce){ pctEl.textContent = to.toFixed(1) + '%'; return; }
    var t0 = performance.now(), dur = 550;
    function step(t){
      var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3);
      pctEl.textContent = (from + (to - from) * k).toFixed(1) + '%';
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function refresh(){
    var rows = list.querySelectorAll('li');
    var c = { P:0, A:0, L:0 };
    rows.forEach(function(r){ c[r.dataset.v]++; });
    countEl.textContent = c.P + ' present · ' + c.A + ' absent · ' + c.L + ' late';

    var me = list.querySelector('li[data-me]').dataset.v;
    var attended = BASE_ATTENDED + (me === 'A' ? 0 : 1);   // late counts as attended
    var pct = Math.round(attended / (BASE_HELD + 1) * 1000) / 10;
    if (pct !== shownPct) {
      animatePct(pct);
      card.classList.add('flash');
      setTimeout(function(){ card.classList.remove('flash'); }, 700);
    }
    var label = { P:'Present', A:'Absent', L:'Late' }[me];
    p2.textContent = label;
    p2.className = 'mini mini-' + me.toLowerCase();
    var ok = pct >= 75;
    statusEl.textContent = ok ? 'Above the 75% minimum' : 'Below the 75% minimum';
    statusEl.style.color = ok ? 'var(--ok)' : 'var(--bad)';
  }

  list.querySelectorAll('li').forEach(function(row){
    row.querySelectorAll('.seg button').forEach(function(b){
      b.addEventListener('click', function(){
        row.querySelectorAll('.seg button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        row.dataset.v = b.dataset.v;
        saveBtn.disabled = false; saveBtn.textContent = 'Save attendance';
        refresh();
      });
    });
  });
  saveBtn.addEventListener('click', function(){
    saveBtn.textContent = 'Saved'; saveBtn.disabled = true;
  });

  /* ---- module filter ---- */
  var filters = document.querySelectorAll('.filter');
  var modules = document.querySelectorAll('#module-grid .module');
  filters.forEach(function(f){
    f.addEventListener('click', function(){
      var want = f.dataset.filter;
      filters.forEach(function(x){ x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
      modules.forEach(function(m){
        m.classList.toggle('is-dim', want !== 'all' && m.dataset.cat !== want);
      });
    });
  });

  /* ---- announcement approval demo ---- */
  var annStatus = document.getElementById('ann-status');
  var annActions = document.getElementById('ann-actions');
  var push = document.getElementById('ann-push');
  var pushWhen = document.getElementById('push-when');
  var actionsHTML = annActions.innerHTML;

  function wireAnn(){
    document.getElementById('ann-approve').addEventListener('click', function(){ decide(true); });
    document.getElementById('ann-reject').addEventListener('click', function(){ decide(false); });
  }
  function decide(approved){
    annStatus.className = 'status ' + (approved ? 'status-ok' : 'status-bad');
    annStatus.textContent = approved ? 'Approved' : 'Rejected';
    push.dataset.state = approved ? 'sent' : 'waiting';
    pushWhen.textContent = approved ? 'now' : 'not sent';
    annActions.innerHTML = '<span class="ann-done">' +
      (approved ? 'Published to BCA Sem 3 · A and B.' : 'Returned to Prof. S. Rao.') +
      '</span> <button type="button" class="link-btn" id="ann-undo">Undo</button>';
    document.getElementById('ann-undo').addEventListener('click', function(){
      annStatus.className = 'status status-warn';
      annStatus.textContent = 'Pending approval';
      push.dataset.state = 'waiting';
      pushWhen.textContent = 'sent to students on approval';
      annActions.innerHTML = actionsHTML;
      wireAnn();
    });
  }
  wireAnn();

  /* ---- copy helpers ---- */
  function selectText(el){
    if (el.select) { el.focus(); el.select(); return; }
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function copy(text, btn, fallbackEl){
    var label = btn.textContent;
    function done(msg){ btn.textContent = msg; setTimeout(function(){ btn.textContent = label; }, 1800); }
    try {
      navigator.clipboard.writeText(text).then(function(){ done('Copied'); }, function(){ selectText(fallbackEl); done('Selected, press Ctrl+C'); });
    } catch (e) { selectText(fallbackEl); done('Selected, press Ctrl+C'); }
  }
  document.getElementById('contact-email').textContent = CONTACT_EMAIL;
  document.getElementById('copy-email').addEventListener('click', function(e){
    copy(CONTACT_EMAIL, e.currentTarget, document.getElementById('contact-email'));
  });

  /* ---- demo form ---- */
  var form = document.getElementById('demo-form');
  var result = document.getElementById('demo-result');
  var bodyEl = document.getElementById('result-body');

  function setErr(id, msg){
    var field = document.getElementById(id).closest('.field');
    var err = document.getElementById('err-' + id.replace('demo-', ''));
    if (msg){ field.setAttribute('data-invalid', ''); err.textContent = msg; }
    else { field.removeAttribute('data-invalid'); err.textContent = ''; }
    return !msg;
  }
  function val(id){ return document.getElementById(id).value.trim(); }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = true;
    ok = setErr('demo-name', val('demo-name') ? '' : 'Enter your name.') && ok;
    var em = val('demo-email');
    ok = setErr('demo-email', !em ? 'Enter your work email.' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) ? '' : 'Check the email address, it looks incomplete.')) && ok;
    ok = setErr('demo-org', val('demo-org') ? '' : 'Enter your college or university.') && ok;
    if (!ok){ var bad = form.querySelector('[data-invalid] input'); if (bad) bad.focus(); return; }

    var data = {
      name: val('demo-name'), email: em, organisation: val('demo-org'), phone: val('demo-phone'),
      role: val('demo-role'), students: val('demo-size'), message: val('demo-msg')
    };
    var text = 'Demo request for Syrantis\n\n' +
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      (data.phone ? 'Phone: ' + data.phone + '\n' : '') +
      'Institution: ' + data.organisation + '\n' +
      'Role: ' + data.role + '\n' +
      'Students: ' + data.students + '\n' +
      (data.message ? '\nWhat I would like to see:\n' + data.message + '\n' : '');

    function showCopyStep(){
      document.getElementById('result-title').textContent = 'Your request is ready to send';
      document.getElementById('result-text').textContent = 'Copy the details below and email them to us at ' + CONTACT_EMAIL + '. We’ll reply to arrange a time.';
      bodyEl.value = text;
      bodyEl.closest('.field').hidden = false;
      document.getElementById('copy-request').hidden = false;
      form.hidden = true; result.hidden = false;
    }
    function showSent(){
      document.getElementById('result-title').textContent = 'Thanks, ' + data.name.split(' ')[0] + '. Your request is with us.';
      document.getElementById('result-text').textContent = 'We’ll email ' + data.email + ' to arrange a time for your demo.';
      bodyEl.closest('.field').hidden = true;
      document.getElementById('copy-request').hidden = true;
      form.hidden = true; result.hidden = false;
    }

    if (!FORM_ENDPOINT){ showCopyStep(); return; }
    var btn = document.getElementById('demo-submit');
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(FORM_ENDPOINT, { method:'POST', headers:{ 'Content-Type':'application/json', 'Accept':'application/json' }, body: JSON.stringify(data) })
      .then(function(r){ if (r.ok) showSent(); else showCopyStep(); })
      .catch(showCopyStep)
      .then(function(){ btn.disabled = false; btn.textContent = 'Request a demo'; });
  });

  ['demo-name','demo-email','demo-org'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){ setErr(id, ''); });
  });
  document.getElementById('copy-request').addEventListener('click', function(e){
    copy(bodyEl.value, e.currentTarget, bodyEl);
  });
  document.getElementById('edit-request').addEventListener('click', function(){
    result.hidden = true; form.hidden = false; document.getElementById('demo-name').focus();
  });
})();
