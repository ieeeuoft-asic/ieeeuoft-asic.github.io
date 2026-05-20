(function () {
  "use strict";

  var canvas = document.getElementById("hero-chip");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var traces = [];
  var pulses = [];
  var rafId = null;
  var visible = true;
  var logicalW = 400;
  var logicalH = 400;

  var COLORS = {
    bg: "#0d1424",
    rail: "rgba(0, 119, 184, 0.55)",
    trace: "rgba(0, 174, 239, 0.28)",
    pad: "rgba(0, 174, 239, 0.65)",
    cell: "rgba(255, 59, 74, 0.12)",
    pulse: "#00aeef"
  };

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    logicalW = rect.width || 400;
    logicalH = rect.height || 400;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;
    canvas.style.width = logicalW + "px";
    canvas.style.height = logicalH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildFloorplan(logicalW, logicalH);
  }

  function buildFloorplan(w, h) {
    traces = [];
    pulses = [];
    var pad = 24;
    var cols = 8;
    var rows = 6;
    var cw = (w - pad * 2) / cols;
    var ch = (h - pad * 2) / rows;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        traces.push({
          type: "cell",
          x: pad + c * cw + 2,
          y: pad + r * ch + 2,
          w: cw - 4,
          h: ch - 4
        });
      }
    }

    var pads = [];
    for (var i = 0; i < 14; i++) {
      pads.push({
        x: pad + Math.random() * (w - pad * 2),
        y: pad + Math.random() * (h - pad * 2)
      });
    }

    for (var j = 0; j < pads.length - 1; j++) {
      var a = pads[j];
      var b = pads[j + 1];
      var path = manhattan(a.x, a.y, b.x, b.y);
      traces.push({ type: "route", points: path });
      if (!reduced && path.length > 2) {
        pulses.push({
          path: path,
          t: Math.random(),
          speed: 0.003 + Math.random() * 0.004
        });
      }
    }

    traces.push({ type: "rail", x1: pad, y1: h / 2, x2: w - pad, y2: h / 2 });
    traces.push({ type: "rail", x1: w / 2, y1: pad, x2: w / 2, y2: h - pad });
  }

  function manhattan(x1, y1, x2, y2) {
    var mx = x1 + (x2 - x1) * 0.5;
    return [
      { x: x1, y: y1 },
      { x: mx, y: y1 },
      { x: mx, y: y2 },
      { x: x2, y: y2 }
    ];
  }

  function pathLength(pts) {
    var len = 0;
    for (var i = 1; i < pts.length; i++) {
      len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return len;
  }

  function pointOnPath(pts, dist) {
    var acc = 0;
    for (var i = 1; i < pts.length; i++) {
      var seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      if (acc + seg >= dist) {
        var r = (dist - acc) / seg;
        return {
          x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * r,
          y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * r
        };
      }
      acc += seg;
    }
    return pts[pts.length - 1];
  }

  function draw() {
    var w = logicalW;
    var h = logicalH;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    traces.forEach(function (t) {
      if (t.type === "cell") {
        ctx.fillStyle = COLORS.cell;
        ctx.strokeStyle = COLORS.trace;
        ctx.lineWidth = 1;
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.strokeRect(t.x, t.y, t.w, t.h);
      } else if (t.type === "rail") {
        ctx.strokeStyle = COLORS.rail;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(t.x1, t.y1);
        ctx.lineTo(t.x2, t.y2);
        ctx.stroke();
      } else if (t.type === "route" && t.points) {
        ctx.strokeStyle = COLORS.trace;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(t.points[0].x, t.points[0].y);
        for (var i = 1; i < t.points.length; i++) {
          ctx.lineTo(t.points[i].x, t.points[i].y);
        }
        ctx.stroke();
        ctx.fillStyle = COLORS.pad;
        ctx.beginPath();
        ctx.arc(t.points[0].x, t.points[0].y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(t.points[t.points.length - 1].x, t.points[t.points.length - 1].y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (!reduced) {
      pulses.forEach(function (p) {
        p.t = (p.t + p.speed) % 1;
        var len = pathLength(p.path);
        var pt = pointOnPath(p.path, p.t * len);
        var g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
        g.addColorStop(0, COLORS.pulse);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  function loop() {
    if (visible) draw();
    if (!reduced) rafId = requestAnimationFrame(loop);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !rafId && !reduced) loop();
      },
      { threshold: 0.1 }
    ).observe(canvas);
  }

  if (!reduced) loop();
})();
