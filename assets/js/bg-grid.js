(function () {
  "use strict";

  var canvas = document.getElementById("bg-grid");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rafId = null;
  var t = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    var w = canvas.width;
    var h = canvas.height;
    var step = 48;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(0, 174, 239, 0.05)";
    ctx.lineWidth = 1;

    for (var x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + (t % step) * 0.1, 0);
      ctx.lineTo(x + (t % step) * 0.1, h);
      ctx.stroke();
    }
    for (var y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0, 119, 184, 0.04)";
    for (var i = 0; i < 12; i++) {
      var px = ((i * 137 + t * 0.5) % w);
      var py = ((i * 89 + t * 0.3) % h);
      ctx.fillRect(px, py, 2, 2);
    }
  }

  function loop() {
    t += reduced ? 0 : 0.15;
    draw();
    if (!reduced) rafId = requestAnimationFrame(loop);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
  if (!reduced) loop();
})();
