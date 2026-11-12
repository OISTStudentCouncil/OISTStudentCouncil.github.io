(function () {
  var index = window.GUIDE_INDEX;
  if (!index) return;

  var plainLetters = { "ā": "a", "á": "a", "à": "a", "ä": "a", "ē": "e", "é": "e", "è": "e", "ī": "i", "í": "i",
    "ō": "o", "ó": "o", "ö": "o", "ū": "u", "ú": "u", "ü": "u" };
  function simplify(s) {
    return s.toLowerCase().replace(/[āáàäēéèīíōóöūúü]/g, function (ch) { return plainLetters[ch]; });
  }
  var entries = index.map(function (e) {
    return { e: e, text: simplify(e.t), head: simplify(e.c + " " + e.s) };
  });

  function count(hay, word) {
    var n = 0, i = hay.indexOf(word);
    while (i !== -1 && n < 20) { n++; i = hay.indexOf(word, i + word.length); }
    return n;
  }

  function snippet(entry, word) {
    var original = entry.e.t, i = entry.text.indexOf(word), p = document.createElement("p");
    if (i === -1) { p.textContent = original.slice(0, 150) + (original.length > 150 ? "…" : ""); return p; }
    var start = Math.max(0, original.lastIndexOf(" ", Math.max(0, i - 60)) + 1);
    var end = Math.min(original.length, i + word.length + 90);
    if (start > 0) p.appendChild(document.createTextNode("…"));
    p.appendChild(document.createTextNode(original.slice(start, i)));
    var mark = document.createElement("mark");
    mark.textContent = original.slice(i, i + word.length);
    p.appendChild(mark);
    p.appendChild(document.createTextNode(original.slice(i + word.length, end) + (end < original.length ? "…" : "")));
    return p;
  }

  document.querySelectorAll(".guide-search").forEach(function (form) {
    var input = form.querySelector("input"), out = form.querySelector(".search-results"), base = form.dataset.base || "";
    form.hidden = false;

    function run() {
      var query = simplify(input.value.trim());
      out.textContent = "";
      if (query.length < 2) return;
      var words = query.split(/\s+/);
      var hits = [];
      entries.forEach(function (entry) {
        var score = 0;
        for (var k = 0; k < words.length; k++) {
          var inHead = entry.head.indexOf(words[k]) !== -1, n = count(entry.text, words[k]);
          if (!inHead && !n) return;
          score += (inHead ? 10 : 0) + Math.min(n, 5);
        }
        hits.push({ entry: entry, score: score });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      if (!hits.length) {
        var none = document.createElement("p");
        none.className = "search-none";
        none.textContent = "Nothing found. Try another word, or ask us on Discord.";
        out.appendChild(none);
        return;
      }
      var ul = document.createElement("ul");
      hits.slice(0, 8).forEach(function (hit) {
        var e = hit.entry.e, li = document.createElement("li"), a = document.createElement("a");
        a.href = base + e.u + (e.a ? "#" + e.a : "");
        a.textContent = e.a ? e.c + ": " + e.s : e.c;
        li.appendChild(a);
        li.appendChild(snippet(hit.entry, words[0]));
        ul.appendChild(li);
      });
      out.appendChild(ul);
    }

    input.addEventListener("input", run);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var first = out.querySelector("a");
      if (first) location.href = first.href;
    });
  });
})();
