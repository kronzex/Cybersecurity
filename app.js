// Заглушка навигации для UI-прототипа: реальной логики и состояния пока нет.
document.addEventListener('DOMContentLoaded', () => {
  const routes = {
    map: 'index.html',
    lesson: 'lesson.html',
  };

  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = routes[el.dataset.nav];
      if (!target) return;
      event.preventDefault();
      window.location.href = target;
    });
  });

  document.querySelectorAll('.module--locked').forEach((el) => {
    el.addEventListener('click', () => {
      console.info('[CyberProtect] Модуль заблокирован. Завершите предыдущий модуль.');
    });
  });

  document.querySelectorAll('.steps-list a, .lesson-nav a').forEach((el) => {
    el.addEventListener('click', (event) => event.preventDefault());
  });
});
