(function () {
  "use strict";

  var counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-counter"), 10);
    var suffix = el.getAttribute("data-counter-suffix") || "";
    if (reduced || isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }

    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window) || reduced) {
    counters.forEach(animateCounter);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(function (el) {
    observer.observe(el);
  });
})();
