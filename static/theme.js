(function () {
  var root = document.documentElement, btn = document.querySelector('.theme'), label = btn && btn.querySelector('.theme-label');
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function current() { return root.dataset.theme || (media.matches ? 'dark' : 'light'); }
  function render() { if (label) label.textContent = current() === 'dark' ? 'Light mode' : 'Dark mode'; }
  if (btn) btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    render();
  });
  media.addEventListener && media.addEventListener('change', render);
  render();
})();
