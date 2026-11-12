(function () {
  var thread = document.querySelector('.thread');
  if (!thread) return;
  var paths = [].slice.call(thread.querySelectorAll('path'));
  function show() { paths.forEach(function (p) { p.style.strokeDashoffset = '0'; }); }
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return show();
    var lens = paths.map(function (p) {
      var box = p.ownerSVGElement.getBoundingClientRect(), vb = p.ownerSVGElement.viewBox.baseVal;
      var scale = p.ownerSVGElement.classList.contains('thread-side') ? box.width / vb.width : box.height / vb.height;
      return p.getTotalLength() * scale;
    });
    var total = lens.reduce(function (a, b) { return a + b; }, 0);
    if (!(total > 0)) return show();
    var duration = Math.min(3200, Math.max(2000, 1400 + total));
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var d = total * (1 - Math.cos(Math.PI * t)) / 2;
      for (var i = 0; i < paths.length; i++) {
        var f = Math.max(0, Math.min(1, d / lens[i]));
        paths[i].style.strokeDashoffset = String(1 - f);
        d -= lens[i];
      }
      if (t < 1) requestAnimationFrame(frame);
    }
    setTimeout(function () { requestAnimationFrame(frame); }, 200);
  } catch (e) { show(); }
})();
