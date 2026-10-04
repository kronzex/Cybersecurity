// UI-прототип: данные захардкожены, реальной логики прогресса нет.
const MODULES = {
  1: {
    title: 'Цифровая гигиена',
    lessons: { 1: 'Надёжные пароли', 2: 'Двухфакторная аутентификация', 3: 'Безопасный Wi-Fi' },
    done: [1],
  },
  2: {
    title: 'Фишинг и Социнженерия',
    lessons: { 1: 'Что такое фишинг', 2: 'Поддельные сайты', 3: 'Социальная инженерия' },
    done: [],
  },
};

function initTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  if (!tabs.length) return;

  const select = (tab, { focus = false } = {}) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls') || '');
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    history.replaceState(null, '', `#module-${tab.dataset.module}`);
  };

  const isLocked = (tab) => tab.getAttribute('aria-disabled') === 'true';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (isLocked(tab)) {
        tab.classList.remove('is-shake');
        void tab.offsetWidth;
        tab.classList.add('is-shake');
        return;
      }
      select(tab);
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const open = tabs.filter((t) => !isLocked(t));
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = open[(open.indexOf(tab) + step + open.length) % open.length];
      select(next, { focus: true });
      e.preventDefault();
    });
  });

  const fromHash = tabs.find((t) => `#module-${t.dataset.module}` === location.hash && !isLocked(t));
  if (fromHash) select(fromHash);
}

function initLockedNodes() {
  document.querySelectorAll('.node--locked').forEach((node) => {
    node.addEventListener('click', (e) => e.preventDefault());
  });
}

function initLesson() {
  const list = document.getElementById('lesson-list');
  if (!list) return;

  const id = new URLSearchParams(location.search).get('id') || '2.2';
  const [m, n] = id.split('.').map(Number);
  const mod = MODULES[m];
  if (!mod || !mod.lessons[n]) return;

  const total = Object.keys(mod.lessons).length;
  document.getElementById('lesson-module-num').textContent = `Модуль ${m}`;
  document.getElementById('lesson-module-title').textContent = mod.title;
  document.getElementById('lesson-counter').textContent = `${n} из ${total}`;
  document.getElementById('lesson-bar').style.width = `${Math.round((n / total) * 100)}%`;
  document.getElementById('lesson-subtitle').textContent = `Урок ${m}.${n} · ${mod.lessons[n]}`;
  document.title = `CyberProtect — Урок ${m}.${n}`;

  list.innerHTML = Object.keys(mod.lessons)
    .map(Number)
    .map((i) => {
      const cls = i === n ? 'is-current' : mod.done.includes(i) ? 'is-done' : '';
      const dot = mod.done.includes(i) && i !== n ? '✓' : i;
      return `<li><a href="lesson.html?id=${m}.${i}" class="${cls}"><span class="dot">${dot}</span> Урок ${m}.${i}</a></li>`;
    })
    .join('');
}

function initNav() {
  const routes = { map: 'index.html', lesson: 'lesson.html' };
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = routes[el.dataset.nav];
      if (!target) return;
      e.preventDefault();
      window.location.href = target;
    });
  });
  document.querySelectorAll('.lesson-nav a').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLockedNodes();
  initLesson();
  initNav();
});
