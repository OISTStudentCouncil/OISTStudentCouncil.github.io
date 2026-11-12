(function () {
  var nav = document.querySelector('.side-nav');
  if (!nav || !('IntersectionObserver' in window)) return;
  var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function (a) { return document.getElementById(decodeURIComponent(a.hash.slice(1))); });
  if (!links.length || targets.indexOf(null) !== -1) return;
  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    for (var i = 0; i < targets.length; i++) {
      if (visible[targets[i].id]) {
        links.forEach(function (a, j) { a.classList.toggle('is-active', j === i); });
        break;
      }
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  targets.forEach(function (t) { io.observe(t); });
})();
