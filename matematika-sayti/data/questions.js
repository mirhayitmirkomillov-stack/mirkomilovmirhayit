const TOPICS = [];

function f(v) {
  return String(v).replace('.', ',');
}

function esc(v) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(v).replace(/[&<>"']/g, (c) => map[c]);
}

function tx(x, y, text, cls) {
  return '<text x="' + x + '" y="' + y + '" class="tx' + (cls ? ' ' + cls : '') + '">' + esc(text) + '</text>';
}

function ln(x1, y1, x2, y2, cls) {
  return '<path class="' + (cls || 'ln') + '" d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '"/>';
}

function poly(points, cls) {
  return '<polygon class="' + (cls || 'ln') + '" points="' + points.map((p) => p[0] + ',' + p[1]).join(' ') + '"/>';
}

function circle(cx, cy, r, cls) {
  return '<circle class="' + (cls || 'ln') + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
}

function dot(x, y, cls) {
  return '<circle class="' + (cls || 'pt') + '" cx="' + x + '" cy="' + y + '" r="4"/>';
}

function rpt(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

function arc(cx, cy, r, a1, a2, label, cls) {
  const p1 = rpt(cx, cy, r, a1);
  const p2 = rpt(cx, cy, r, a2);
  const pm = rpt(cx, cy, r + 17, (a1 + a2) / 2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  return '<path class="' + (cls || 'acc') + '" d="M' + f(p1[0]) + ' ' + f(p1[1]) + ' A' + r + ' ' + r + ' 0 ' + large + ' ' + sweep + ' ' + f(p2[0]) + ' ' + f(p2[1]) + '"/>' + tx(pm[0] - 13, pm[1], label, 'sm');
}

function rightMark(x, y, s) {
  return '<path class="thin" d="M' + x + ' ' + (y - s) + 'L' + (x + s) + ' ' + (y - s) + 'L' + (x + s) + ' ' + y + '"/>';
}

function parMark(x, y, n) {
  let body = '';
  for (let k = 0; k < (n || 1); k++) {
    const dx = k * 8;
    body += '<path class="thin" d="M' + (x - 6 + dx) + ' ' + (y + 5) + 'l7 -5 -7 -5"/>';
  }
  return body;
}

function tick(x1, y1, x2, y2, n) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len * 6;
  const ny = dx / len * 6;
  let body = '';
  for (let k = 0; k < (n || 1); k++) {
    const ox = dx / len * k * 4;
    const oy = dy / len * k * 4;
    body += ln(mx + nx + ox, my + ny + oy, mx - nx + ox, my - ny + oy, 'thin');
  }
  return body;
}

function svg(body) {
  return '<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Geometrik chizma">' +
    '<style>' +
    '.ln{fill:none;stroke:#3d4b69;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.thin{fill:none;stroke:#6b7894;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}' +
    '.bold{fill:none;stroke:#2a3756;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}' +
    '.acc{fill:none;stroke:#e4572e;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}' +
    '.dash{fill:none;stroke:#6b7894;stroke-width:1.7;stroke-dasharray:6 5;stroke-linecap:round}' +
    '.fill{fill:#f2f5ff;stroke:#3d4b69;stroke-width:2.2}' +
    '.tx{fill:#1f2a44;font:15px "Segoe UI",Arial,sans-serif}' +
    '.sm{font-size:13px}.lg{font-size:18px;font-weight:600}' +
    '.pt{fill:#2a3756}.hot{fill:#e4572e}' +
    '</style>' + body + '</svg>';
}

function make(id, q, answer, extras, explain, diagram) {
  const raw = [answer].concat(extras).filter((v) => v !== undefined && v !== null && String(v).trim() !== '' && !/^\s*-/.test(String(v)));
  const seen = [];
  raw.forEach((v) => { if (seen.indexOf(v) === -1) seen.push(v); });
  if (seen.length < 4) {
    const m = String(answer).match(/^(\d+(?:[,.]\d+)?)(.*)$/);
    if (m) {
      const num = parseFloat(m[1].replace(',', '.'));
      const unit = m[2];
      [num + 1, num + 2, num + 3, num * 2, num + 10, Math.max(1, num - 1)].forEach((v) => {
        const candidate = f(v) + unit;
        if (seen.length < 4 && seen.indexOf(candidate) === -1 && !/^-/.test(candidate)) seen.push(candidate);
      });
    } else {
      ['Boshqa qiymat', 'Aniqlab bo\'lmaydi', 'Noto\'g\'ri', 'Hech biri'].forEach((v) => {
        if (seen.length < 4 && seen.indexOf(v) === -1) seen.push(v);
      });
    }
  }
  while (seen.length < 4) seen.push('—');
  const seed = parseInt(id.split('-').pop(), 10) || 0;
  const shift = seed % seen.length;
  const options = seen.map((_, i) => seen[(i + shift) % seen.length]);
  return { id, q, options, answer: options.indexOf(answer), explain, diagram };
}

function dParallel(a, x, kind) {
  let body = ln(60, 65, 460, 65) + ln(60, 185, 460, 185) + ln(95, 225, 425, 35, 'acc') +
    parMark(120, 65, 1) + parMark(120, 185, 1) + parMark(430, 65, 1) + parMark(430, 185, 1) +
    tx(65, 52, 'a', 'sm') + tx(65, 172, 'b', 'sm') + tx(432, 28, 'k', 'sm');
  if (kind === 'same') {
    body += arc(373, 65, 25, 340, 400, a + '°') + arc(165, 185, 25, 150, 210, 'x');
  } else if (kind === 'perpendicular') {
    body += ln(260, 25, 260, 230, 'acc') + rightMark(260, 65, 13) + rightMark(260, 185, 13) + tx(275, 45, '90°', 'sm');
  } else if (kind === 'zigzag') {
    body += ln(165, 185, 260, 125, 'thin') + ln(260, 125, 373, 65, 'thin') +
      arc(165, 185, 22, 20, 60, a + '°') + arc(373, 65, 22, 190, 230, x + '°') + tx(230, 140, 'x = a + b', 'sm');
  } else {
    body += arc(373, 65, 25, 320, 380, a + '°') + arc(165, 185, 25, 320, 380, 'x');
  }
  return svg(body);
}

function dVertical(a, x) {
  return svg(ln(80, 60, 440, 190) + ln(120, 210, 400, 40) + dot(260, 125) +
    arc(260, 125, 34, 120, 180, a + '°') + arc(260, 125, 34, 300, 360, 'x') +
    tx(238, 112, 'O', 'sm') + tx(65, 45, 'A', 'sm') + tx(440, 200, 'B', 'sm'));
}

function dAround(a, b) {
  return svg(ln(260, 125, 260, 35) + ln(260, 125, 410, 185) + ln(260, 125, 105, 185) +
    dot(260, 125) + arc(260, 125, 32, 30, 90, a + '°') + arc(260, 125, 32, 90, 180, b + '°') + arc(260, 125, 32, 180, 330, 'x') +
    tx(248, 145, 'O', 'sm'));
}

function dBisectorAngle(a, half) {
  return svg(ln(90, 200, 430, 200) + ln(90, 200, 300, 55) + ln(90, 200, 360, 85, 'acc') + dot(90, 200) +
    arc(90, 200, 42, 20, 55, half) + arc(90, 200, 42, 55, 90, half) +
    tx(75, 218, 'A') + tx(300, 48, 'B') + tx(365, 78, 'C') + tx(145, 235, 'AD bissektrisa', 'sm'));
}

function dTriangle(kind, a, b, x) {
  if (kind === 'right') {
    return svg(poly([[100, 55], [100, 205], [425, 205]], 'fill') + rightMark(100, 205, 15) +
      dot(100, 55) + dot(100, 205) + dot(425, 205) + tx(86, 46, 'A') + tx(82, 225, 'B') + tx(430, 225, 'C') +
      arc(100, 55, 28, 280, 360, a + '°') + arc(425, 205, 28, 140, 180, b + '°') + tx(230, 245, 'x = 90° − ' + a + '°', 'sm'));
  }
  if (kind === 'exterior') {
    return svg(poly([[260, 40], [80, 205], [440, 205]], 'fill') + ln(440, 205, 495, 205, 'acc') +
      dot(260, 40) + dot(80, 205) + dot(440, 205) + tx(250, 30, 'A') + tx(65, 225, 'B') + tx(435, 225, 'C') +
      arc(260, 40, 30, 240, 300, a + '°') + arc(80, 205, 28, 0, 50, b + '°') + arc(440, 205, 30, 0, 120, 'x') +
      tx(455, 190, x + '°', 'sm'));
  }
  let body = poly([[260, 35], [80, 210], [440, 210]], kind === 'iso' ? 'fill' : 'ln') +
    dot(260, 35) + dot(80, 210) + dot(440, 210) + tx(250, 25, 'A') + tx(65, 230, 'B') + tx(440, 230, 'C') +
    arc(260, 35, 30, 235, 305, a + '°') + arc(80, 210, 28, 0, 55, b + '°') + arc(440, 210, 28, 125, 180, 'x');
  if (kind === 'iso') body += tick(260, 35, 80, 210, 1) + tick(260, 35, 440, 210, 1);
  return svg(body);
}

function dBisectorTriangle(a, b) {
  return svg(poly([[260, 35], [80, 210], [440, 210]], 'fill') + ln(260, 35, 260, 210, 'acc') +
    dot(260, 35) + dot(80, 210) + dot(260, 210) + dot(440, 210) +
    tx(250, 25, 'A') + tx(65, 230, 'B') + tx(250, 230, 'D') + tx(440, 230, 'C') +
    arc(260, 35, 28, 235, 270, f(a / 2) + '°') + arc(260, 35, 28, 270, 305, f(a / 2) + '°') +
    tx(100, 200, b + '°', 'sm') + tx(285, 150, 'AD bissektrisa', 'sm'));
}

function dMedian(m, part) {
  return svg(poly([[260, 35], [80, 210], [440, 210]], 'fill') + ln(260, 35, 260, 210, 'acc') +
    dot(260, 35) + dot(260, 122) + dot(260, 210) + tx(250, 25, 'A') + tx(250, 115, 'G', 'sm') + tx(250, 230, 'D') +
    tick(80, 210, 260, 210, 1) + tick(260, 210, 440, 210, 1) +
    tx(275, 80, f(part) + ' = 2m/3', 'sm') + tx(275, 180, 'm/3', 'sm'));
}

function dIncenter(a, result) {
  return svg(poly([[260, 35], [80, 210], [440, 210]], 'fill') +
    ln(260, 35, 170, 210, 'dash') + ln(80, 210, 310, 90, 'dash') + ln(440, 210, 190, 105, 'dash') +
    dot(245, 150, 'hot') + tx(230, 140, 'I', 'sm') + tx(250, 25, 'A') + tx(65, 230, 'B') + tx(440, 230, 'C') +
    arc(260, 35, 28, 240, 300, a + '°') + tx(150, 240, '∠BIC = ' + result + '°', 'sm'));
}

function dCircum(h, r) {
  return svg(poly([[100, 205], [100, 60], [425, 205]], 'fill') + rightMark(100, 205, 14) +
    circle(262, 132, r * 3.2, 'thin') + dot(262, 132, 'hot') + tx(248, 125, 'O', 'sm') +
    tx(86, 50, 'A') + tx(82, 225, 'B') + tx(430, 225, 'C') + tx(215, 245, 'BC = ' + h + ', R = ' + r, 'sm'));
}

function dSimilar(k, side, result) {
  return svg(poly([[80, 55], [45, 180], [190, 180]], 'fill') + poly([[300, 35], [245, 215], [470, 215]], 'fill') +
    dot(80, 55) + dot(45, 180) + dot(190, 180) + dot(300, 35) + dot(245, 215) + dot(470, 215) +
    tx(70, 45, 'A') + tx(32, 198, 'B') + tx(195, 198, 'C') + tx(290, 25, "A'") + tx(232, 235, "B'") + tx(475, 235, "C'") +
    tx(100, 200, side, 'sm') + tx(350, 200, result, 'sm') + tx(220, 245, "ABC ~ A'B'C', k = " + k, 'sm'));
}

function dTrig(a, b, c) {
  return svg(poly([[100, 55], [100, 205], [425, 205]], 'fill') + rightMark(100, 205, 14) +
    tx(86, 45, 'A') + tx(82, 225, 'B') + tx(430, 225, 'C') +
    tx(65, 140, a, 'sm') + tx(230, 225, b, 'sm') + tx(255, 105, c, 'sm') +
    arc(100, 55, 28, 280, 360, 'α') + tx(185, 245, 'sin α = ' + a + '/' + c, 'sm'));
}

function dCircle(kind, a, x) {
  const base = circle(260, 125, 80) + dot(260, 125) + tx(248, 145, 'O', 'sm');
  if (kind === 'inscribed') {
    return svg(base + ln(180, 125, 340, 125, 'acc') + ln(260, 45, 260, 205) +
      dot(180, 125) + dot(340, 125) + tx(165, 115, 'A', 'sm') + tx(345, 115, 'B', 'sm') +
      arc(260, 125, 30, 0, a, x) + tx(180, 240, 'markaziy burchak = yoy o\'lchami', 'sm'));
  }
  if (kind === 'tangent') {
    return svg(base + ln(260, 125, 340, 125, 'acc') + ln(340, 45, 340, 205, 'acc') + rightMark(340, 125, 12) +
      dot(340, 125, 'hot') + tx(248, 145, 'O', 'sm') + tx(350, 120, 'T', 'sm') + tx(300, 115, a, 'sm') + tx(185, 240, 'Urinma radiusga perpendikulyar', 'sm'));
  }
  if (kind === 'chords') {
    return svg(base + ln(190, 70, 330, 180, 'acc') + ln(190, 180, 330, 70, 'acc') + dot(260, 125, 'hot') +
      tx(175, 60, 'A', 'sm') + tx(335, 195, 'B', 'sm') + tx(175, 195, 'C', 'sm') + tx(335, 60, 'D', 'sm') +
      tx(220, 115, 'P', 'sm') + tx(180, 240, 'PA·PB = PC·PD', 'sm'));
  }
  return svg(base + ln(180, 125, 340, 125, 'acc') + ln(260, 45, 340, 195, 'acc') +
    tx(165, 115, 'A', 'sm') + tx(345, 115, 'B', 'sm') + tx(250, 38, 'C', 'sm') +
    arc(260, 125, 30, 0, 60, a + '°') + arc(260, 125, 44, 60, 150, 'x') + tx(165, 240, 'yozilgan burchak = yoyning yarmi', 'sm'));
}

function dQuad(kind, a, x) {
  if (kind === 'square') {
    return svg(poly([[140, 45], [380, 45], [380, 205], [140, 205]], 'fill') + ln(140, 45, 380, 205, 'acc') + ln(380, 45, 140, 205, 'acc') +
      dot(260, 125, 'hot') + rightMark(140, 205, 14) + tx(125, 35, 'A') + tx(385, 35, 'B') + tx(385, 225, 'C') + tx(125, 225, 'D') +
      tx(255, 105, 'O', 'sm') + tx(200, 120, a, 'sm') + tx(215, 240, 'kvadrat diagonali', 'sm'));
  }
  if (kind === 'parallelogram') {
    return svg(poly([[100, 195], [175, 60], [445, 60], [370, 195]], 'fill') + ln(175, 60, 370, 195, 'acc') +
      parMark(120, 190, 1) + parMark(395, 190, 1) + tx(85, 215, 'A') + tx(165, 48, 'B') + tx(450, 48, 'C') + tx(375, 215, 'D') +
      arc(100, 195, 28, 0, 60, a + '°') + arc(445, 60, 28, 180, 240, a + '°') + tx(210, 240, 'qarama-qarshi burchaklar teng', 'sm'));
  }
  if (kind === 'trapezoid') {
    return svg(poly([[90, 195], [185, 70], [405, 70], [440, 195]], 'fill') +
      parMark(180, 70, 1) + parMark(180, 195, 1) + tx(75, 215, 'A') + tx(175, 58, 'B') + tx(410, 58, 'C') + tx(445, 215, 'D') +
      arc(90, 195, 28, 0, 65, a + '°') + arc(440, 195, 28, 115, 180, 'x') + tx(205, 240, 'AD ∥ BC', 'sm'));
  }
  return svg(poly([[110, 195], [250, 55], [410, 175], [270, 205]], 'fill') +
    tick(110, 195, 250, 55, 1) + tick(250, 55, 410, 175, 1) + tick(410, 175, 270, 205, 1) + tick(270, 205, 110, 195, 1) +
    ln(110, 195, 410, 175, 'acc') + ln(250, 55, 270, 205, 'acc') + dot(260, 125, 'hot') +
    tx(95, 215, 'A') + tx(240, 42, 'B') + tx(415, 170, 'C') + tx(265, 225, 'D') + tx(205, 245, 'rombdagi burchak ' + x, 'sm'));
}

function dCeva(kind, vals) {
  const pts = [[260, 30], [70, 215], [455, 215]];
  let body = poly(pts, 'fill') + ln(260, 30, 260, 215, 'acc');
  if (kind === 'ceva') {
    body += ln(70, 215, 350, 95, 'dash') + ln(455, 215, 170, 95, 'dash') + dot(260, 145, 'hot');
  } else {
    body += ln(70, 215, 430, 75, 'acc') + dot(310, 130, 'hot');
  }
  body += dot(260, 30) + dot(70, 215) + dot(455, 215) + dot(260, 215) +
    tx(250, 20, 'A') + tx(55, 235, 'B') + tx(458, 235, 'C') + tx(250, 235, 'D') +
    tx(115, 228, vals[0], 'sm') + tx(330, 228, vals[1], 'sm') + tx(280, 145, vals[2], 'sm');
  return svg(body);
}

function addTopic(id, title, description, questions) {
  TOPICS.push({ id, title, description, questionCount: 30, active: true, questions });
}

function buildBurchaklar() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('burchaklar-' + (qs.length + 1), q, a, e, ex, d));
  [40, 55, 70].forEach((a) => {
    add(`a ∥ b, mos burchak m(ABC) = ${a}° bo'lsa, x ni toping.`, a + '°', [(a + 15) + '°', (180 - a) + '°', '90°'], 'Mos burchaklar teng.', dParallel(a, 'x', 'corresponding'));
    add(`a ∥ b, bir tomonlama ichki burchaklardan biri ${a}° bo'lsa, ikkinchisi nechaga teng?`, (180 - a) + '°', [a + '°', (90 - a) + '°', (a + 30) + '°'], 'Bir tomonlama ichki burchaklar yig\'indisi 180°.', dParallel(a, 'x', 'same'));
    add(`Ikki chiziq kesishganda burchaklardan biri ${a}° bo'lsa, unga qarama-qarshi burchak x ni toping.`, a + '°', [(180 - a) + '°', (90 - a) + '°', (a + 20) + '°'], 'Vertikal burchaklar teng.', dVertical(a, 'x'));
    add(`Qo'shni burchaklardan biri ${a}° bo'lsa, ikkinchisi x ni toping.`, (180 - a) + '°', [a + '°', (a + 10) + '°', (90 - a) + '°'], 'Qo\'shni burchaklar yig\'indisi 180°.', dVertical(a, 'x'));
    add(`${a}° li burchakning to'ldiruvchisi x necha gradus?`, (90 - a) + '°', [a + '°', (180 - a) + '°', (a + 5) + '°'], 'To\'ldiruvchi burchaklar yig\'indisi 90°.', dBisectorAngle(a, 'x'));
    add(`Bir nuqtadan chiqqan uch nur ketma-ket ${a}°, ${a + 20}° va x li burchaklar hosil qilsa, x ni toping.`, (340 - 2 * a) + '°', [(180 - a) + '°', (320 - 2 * a) + '°', (360 - a) + '°'], 'Atrof burchaklar yig\'indisi 360°.', dAround(a, a + 20));
  });
  [90, 120, 150].forEach((s, i) => {
    const p = [2, 1, 2][i];
    const q = [3, 3, 3][i];
    const part = s * q / (p + q);
    add(`Burchak ${s}° bo'lib, uning bissektrisasi hosil qilgan har bir burchak x ni toping.`, f(s / 2) + '°', [s + '°', f(s / 3) + '°', f(s / 4) + '°'], 'Bissektrisa burchakni teng ikkiga bo\'ladi.', dBisectorAngle(s, f(s / 2) + '°'));
    add(`${s}° li burchak ichidagi nur uni ${p}:${q} nisbatda bo'lsa, katta qism x ni toping.`, f(part) + '°', [f(s / 2) + '°', f(s * p / (p + q)) + '°', f(s / 3) + '°'], 'Nisbat bo\'yicha katta qism s·q/(p+q).', dAround(s * p / (p + q), s));
  });
  [2, 4, 5].forEach((k) => {
    const val = 90 * k / (k + 1);
    add(`Burchak o'zining to'ldiruvchisidan ${k} barobar katta bo'lsa, shu burchak x ni toping.`, f(val) + '°', [(90 - val) + '°', (180 - val) + '°', (90 / k) + '°'], 'x = k(90 − x) tenglamadan topiladi.', dBisectorAngle(val, 'x'));
  });
  [80, 100, 140].forEach((a) => {
    add(`Bir nuqtadan chiqqan uch nur ${a}°, ${120 - a / 2}° va x li burchak hosil qilsa, x ni toping.`, (240 - a / 2) + '°', [(360 - a) + '°', (a + 20) + '°', (360 - 2 * a) + '°'], 'Atrof burchaklar yig\'indisi 360°.', dAround(a, 120 - a / 2));
  });
  return qs;
}

function buildParallel() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('parallel-' + (qs.length + 1), q, a, e, ex, d));
  [35, 50, 65].forEach((a) => {
    add(`a ∥ b va kesuvchi bilan hosil bo'lgan mos burchak ${a}° bo'lsa, x ni toping.`, a + '°', [(180 - a) + '°', (90 - a) + '°', (a + 25) + '°'], 'Mos burchaklar teng.', dParallel(a, 'x', 'corresponding'));
    add(`a ∥ b, ichki almashinma burchak ${a}° bo'lsa, unga almashinma burchak x ni toping.`, a + '°', [(180 - a) + '°', (a + 20) + '°', (90 - a) + '°'], 'Ichki almashinma burchaklar teng.', dParallel(a, 'x', 'corresponding'));
    add(`a ∥ b va bir tomonlama ichki burchak ${a}° bo'lsa, qarshisidagi ichki burchak x ni toping.`, (180 - a) + '°', [a + '°', (90 - a) + '°', (a + 15) + '°'], 'Bir tomonlama ichki burchaklar yig\'indisi 180°.', dParallel(a, 'x', 'same'));
    add(`Kesuvchi hosil qilgan qo'shni burchak ${a}° bo'lsa, ikkinchisi x ni toping.`, (180 - a) + '°', [a + '°', (a + 30) + '°', (90 - a) + '°'], 'Qo\'shni burchaklar to\'ldiruvchi.', dVertical(a, 'x'));
    add(`a ∥ b va a chiziqqa perpendikulyar bo'lgan kesuvchi b bilan qanday burchak hosil qiladi?`, '90°', [a + '°', (180 - a) + '°', '45°'], 'Perpendikulyar kesuvchi har ikki parallel chiziqqa ham perpendikulyar.', dParallel(a, 'x', 'perpendicular'));
    add(`a ∥ b, ichki burchaklar nisbati ${a}:${180 - a} bo'lsa, kichik burchak x ni toping.`, Math.min(a, 180 - a) + '°', [Math.max(a, 180 - a) + '°', '90°', (a / 2) + '°'], '180° nisbat bo\'yicha taqsimlanadi.', dParallel(a, 'x', 'same'));
  });
  [[30, 40], [25, 35], [40, 50]].forEach(([a, b]) => {
    add(`a ∥ b, ikki parallel chiziq orasidagi sindirilgan chiziq burchaklari ${a}° va ${b}° bo'lsa, x ni toping.`, (a + b) + '°', [(180 - a - b) + '°', (a + b + 20) + '°', (2 * a + b) + '°'], 'Sindirilgan chiziq orasidagi burchak ikki burchak yig\'indisiga teng.', dParallel(a, b, 'zigzag'));
  });
  [20, 30, 45].forEach((a) => {
    add(`a ∥ b da tashqi almashinma burchak ${a}° bo'lsa, unga teng burchak x ni toping.`, a + '°', [(180 - a) + '°', (a + 10) + '°', (90 - a) + '°'], 'Tashqi almashinma burchaklar teng.', dParallel(a, 'x', 'corresponding'));
  });
  [25, 40, 55].forEach((a) => {
    add(`a ∥ b va kesuvchi bilan hosil bo'lgan ikki ichki burchak yig'indisi 180° bo'lsa, ular bir tomonlamami?`, 'Ha', ['Yo\'q', 'Almashinma', 'Mos'], 'Bir tomonlama ichki burchaklar yig\'indisi 180°.', dParallel(a, 'x', 'same'));
    add(`Kesuvchi a chiziq bilan ${a}° burchak hosil qilsa, unga qo'shni burchak x ni toping.`, (180 - a) + '°', [a + '°', (90 - a) + '°', (a + 20) + '°'], 'Qo\'shni burchaklar yig\'indisi 180°.', dVertical(a, 'x'));
  });
  return qs;
}

function buildUchburchak() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('uchburchak-burchaklari-' + (qs.length + 1), q, a, e, ex, d));
  [[50, 60], [40, 75], [65, 45]].forEach(([a, b]) => {
    add(`Uchburchakning ikki ichki burchagi ${a}° va ${b}° bo'lsa, uchinchisi x ni toping.`, (180 - a - b) + '°', [(a + b) + '°', (180 - a) + '°', (90 - a) + '°'], 'Ichki burchaklar yig\'indisi 180°.', dTriangle('basic', a, b, 'x'));
    add(`Tashqi burchak ${a + b}° bo'lsa, uzoqdagi ichki burchaklardan biri ${a}° bo'lganda ikkinchisi x ni toping.`, b + '°', [a + '°', (a + b) + '°', (180 - b) + '°'], 'Tashqi burchak uzoqdagi ikki ichki burchak yig\'indisiga teng.', dTriangle('exterior', a, b, 'x'));
  });
  [40, 50, 70].forEach((a) => {
    add(`Teng yonli uchburchakning tepalik burchagi ${a}° bo'lsa, asosdagi burchak x ni toping.`, f((180 - a) / 2) + '°', [a + '°', f(180 - 2 * a) + '°', f(180 - a) + '°'], 'Asosdagi burchaklar teng.', dTriangle('iso', a, 'x', 'x'));
  });
  [50, 65, 80].forEach((a) => {
    add(`Teng yonli uchburchakning asosdagi burchagi ${a}° bo'lsa, tepalik burchak x ni toping.`, (180 - 2 * a) + '°', [a + '°', (2 * a) + '°', (90 - a) + '°'], 'Tepalik burchak 180° − 2a.', dTriangle('iso', 'x', a, 'x'));
  });
  [[30, 40, 50], [20, 60, 100], [45, 45, 90]].forEach(([a, b, c]) => {
    add(`Uchburchak burchaklari ${a}°, ${b}° va ${c}° bo'lsa, eng katta burchak x ni toping.`, c + '°', [a + '°', b + '°', (180 - a) + '°'], 'Eng katta qiymat berilgan burchaklardan biri.', dTriangle('basic', a, b, c));
  });
  [25, 35, 55].forEach((a) => {
    add(`To'g'ri burchakli uchburchakning o'tkir burchagi ${a}° bo'lsa, ikkinchi o'tkir burchak x ni toping.`, (90 - a) + '°', [a + '°', (180 - a) + '°', (90 + a) + '°'], 'O\'tkir burchaklar yig\'indisi 90°.', dTriangle('right', a, 'x', 'x'));
  });
  [2, 3, 4].forEach((k) => {
    const a = 180 / (k + 2);
    add(`Uchburchak burchaklari 1:1:${k} nisbatda bo'lsa, eng katta burchak x ni toping.`, f(k * a) + '°', [f(a) + '°', f(180 - a) + '°', f(a / 2) + '°'], '180° nisbat bo\'yicha taqsimlanadi.', dTriangle('basic', f(a), f(a), 'x'));
  });
  [[1, 3, 5], [2, 3, 7], [1, 4, 7]].forEach(([p, q, r]) => {
    const mid = 180 * q / (p + q + r);
    add(`Uchburchak burchaklari ${p}:${q}:${r} nisbatda bo'lsa, o'rta burchak x ni toping.`, f(mid) + '°', [f(180 * p / (p + q + r)) + '°', f(180 * r / (p + q + r)) + '°', '90°'], '180° nisbat bo\'yicha taqsimlanadi.', dTriangle('basic', p + 'q', q + 'q', 'x'));
  });
  [50, 65, 75].forEach((a) => {
    add(`Teng yonli uchburchakning asosdagi burchagi ${a}° bo'lsa, shu uchdagi tashqi burchak x ni toping.`, (180 - a) + '°', [a + '°', (180 - 2 * a) + '°', (90 - a) + '°'], 'Tashqi burchak qo\'shni ichki burchak bilan 180° tashkil qiladi.', dTriangle('exterior', 'x', a, 'x'));
  });
  [3, 4, 7].forEach((k) => {
    const b = 160 / (k + 1);
    add(`Uchburchakda ∠A = ${k}·∠B va ∠C = 20° bo'lsa, ∠B = x ni toping.`, f(b) + '°', [f(k * b) + '°', '20°', f(180 - b) + '°'], 'kb + b + 20 = 180 tenglamadan topiladi.', dTriangle('basic', k + 'x', 'x', '20°'));
  });
  return qs;
}

function buildBissektrisa() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('bissektrisa-' + (qs.length + 1), q, a, e, ex, d));
  [60, 80, 100].forEach((a) => {
    const incenter = 90 + a / 2;
    add(`∠A = ${a}° bo'lgan uchburchakda AD bissektrisa bo'lsa, ∠BAD = x ni toping.`, f(a / 2) + '°', [a + '°', f(a / 3) + '°', f(180 - a) + '°'], 'Bissektrisa burchakni teng ikkiga bo\'ladi.', dBisectorTriangle(a, 'x'));
    add(`Uchburchakning I markazi (incenter) uchun ∠BIC = x toping, ∠A = ${a}°.`, f(incenter) + '°', [f(incenter - 20) + '°', f(incenter + 10) + '°', f(a + 5) + '°'], 'Incenter uchun ∠BIC = 90° + A/2.', dIncenter(a, incenter));
  });
  [12, 18, 24].forEach((m) => {
    add(`AD mediana uzunligi ${m} sm bo'lsa, og'irlik markazi G dan A gacha bo'lgan masofa x ni toping.`, f(2 * m / 3) + ' sm', [f(m / 3) + ' sm', f(m / 2) + ' sm', m + ' sm'], 'Mediana og\'irlik markazida 2:1 nisbatda bo\'linadi.', dMedian(m, 'AG'));
    add(`AD mediana uzunligi ${m} sm bo'lsa, G dan D gacha bo'lgan masofa x ni toping.`, f(m / 3) + ' sm', [f(2 * m / 3) + ' sm', f(m / 2) + ' sm', m + ' sm'], 'Mediana kichik qismi m/3 ga teng.', dMedian(m, 'GD'));
  });
  [10, 14, 20].forEach((h) => {
    add(`To'g'ri burchakli uchburchak gipotenuzasi ${h} sm bo'lsa, uning atrof chiziqqa chizilgan radiusi x ni toping.`, f(h / 2) + ' sm', [h + ' sm', f(h / 3) + ' sm', f(h / 4) + ' sm'], 'To\'g\'ri burchakli uchburchakda R = gipotenuzaning yarmi.', dCircum(h, h / 2));
  });
  [[2, 3, 6], [3, 4, 14], [1, 4, 10]].forEach(([r, s, side]) => {
    add(`Bissektrisa teoremasida AB:AC = ${r}:${s} va BC = ${side} sm bo'lsa, BD ni toping.`, f(side * r / (r + s)) + ' sm', [f(side * s / (r + s)) + ' sm', f(side / 2) + ' sm', f(side * r / s) + ' sm'], 'BD/DC = AB/AC.', dBisectorTriangle(r * 10, 'x'));
  });
  [30, 45, 60].forEach((a) => {
    add(`Ikki qo'shni burchak bissektrisalari orasidagi burchak necha gradus?`, '90°', [a + '°', (180 - a) + '°', (a + 15) + '°'], 'Yarimlar yig\'indisi har doim 90°.', dBisectorAngle(a, '45°'));
  });
  [[60, 15], [90, 18], [120, 20]].forEach(([s, p]) => {
    add(`Uchburchak yuzi ${s} sm², yarim perimetri ${p} sm bo'lsa, ichki aylana radiusi x ni toping.`, f(s / p) + ' sm', [f(2 * s / p) + ' sm', f(p / s) + ' sm', s + ' sm'], 'Ichki aylana radiusi r = S/p.', dIncenter('60', s / p));
  });
  [36, 72, 96].forEach((a) => {
    add(`∠BAC = ${a}° va AD uning bissektrisasi bo'lsa, ∠DAC = x ni toping.`, f(a / 2) + '°', [a + '°', f(a / 3) + '°', f(180 - a) + '°'], 'Bissektrisa burchakni teng ikkiga bo\'ladi.', dBisectorTriangle(a, 'x'));
  });
  [6, 9, 12].forEach((s) => {
    add(`Teng tomonli uchburchak tomoni ${s} sm bo'lsa, uning atrof chiziq radiusi x ni toping.`, f(s) + '√3/3 sm', [f(s) + '√3 sm', f(s / 2) + '√3 sm', f(2 * s) + ' sm'], 'Teng tomonli uchburchakda R = a√3/3.', dCircum(s, s / 2));
  });
  return qs;
}

function buildMuntazam() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('muntazam-kvadrat-' + (qs.length + 1), q, a, e, ex, d));
  [6, 8, 10].forEach((s) => {
    add(`Teng tomonli uchburchak tomoni ${s} sm bo'lsa, uning perimetri x ni toping.`, (3 * s) + ' sm', [(2 * s) + ' sm', (s * s) + ' sm', (4 * s) + ' sm'], 'P = 3a.', dTriangle('iso', '60', '60', 'x'));
    add(`Teng tomonli uchburchak tomoni ${s} sm bo'lsa, balandligi x ni toping.`, f(s) + '√3 sm', [f(2 * s) + '√3 sm', f(s / 2) + '√3 sm', f(s * s) + ' sm'], 'Teng tomonli uchburchakda h = a√3/2, ya\'ni 3√3/2·2=' + f(s) + '√3.', dTriangle('iso', '60', '60', 'h'));
    add(`Teng tomonli uchburchak balandligi ${s}√3 sm bo'lsa, tomoni x ni toping.`, (2 * s) + ' sm', [s + ' sm', (3 * s) + ' sm', f(s * Math.sqrt(3)) + ' sm'], 'a = 2h/√3.', dTriangle('iso', '60', '60', 'x'));
    add(`Kvadrat tomoni ${s} sm bo'lsa, diagonali x ni toping.`, f(s) + '√2 sm', [(2 * s) + ' sm', f(s * s) + ' sm', f(s / 2) + '√2 sm'], 'Kvadrat diagonali a√2.', dQuad('square', s + ' sm', 'x'));
    add(`Kvadrat diagonali ${s}√2 sm bo'lsa, tomoni x ni toping.`, s + ' sm', [(2 * s) + ' sm', f(s) + '√2 sm', f(s * s) + ' sm'], 'Kvadrat tomoni d/√2.', dQuad('square', 'x', s + '√2'));
    add(`Kvadrat tomoni ${s} sm bo'lsa, yuzi x ni toping.`, (s * s) + ' sm²', [(4 * s) + ' sm²', (2 * s * s) + ' sm²', f(s) + '√2 sm²'], 'Kvadrat yuzi a².', dQuad('square', s + ' sm', 'S'));
  });
  [6, 10, 12].forEach((r) => {
    add(`Aylana radiusi ${r} sm bo'lsa, unga ichki chizilgan kvadratning diagonali x ni toping.`, (2 * r) + ' sm', [r + ' sm', f(r * Math.sqrt(2)) + ' sm', (4 * r) + ' sm'], 'Ichki kvadrat diagonali aylana diametriga teng.', dQuad('square', 'x', 2 * r + ' sm'));
    add(`Munzam oltiburchakning tomoni ${r} sm bo'lsa, perimetri x ni toping.`, (6 * r) + ' sm', [(3 * r) + ' sm', (4 * r) + ' sm', (12 * r) + ' sm'], 'Munzam oltiburchakda tomon atrof radiusga teng.', dCircle('inscribed', 60, 'x'));
  });
  [4, 5, 8].forEach((a) => {
    add(`Teng yonli to'g'ri burchakli uchburchakning yoni ${a} sm bo'lsa, gipotenuzasi x ni toping.`, f(a) + '√2 sm', [(2 * a) + ' sm', f(a * a) + ' sm', f(a / 2) + '√2 sm'], 'Gipotenuza a√2.', dTrig('a', 'a', 'x'));
  });
  [6, 8, 10].forEach((s) => {
    add(`Teng tomonli uchburchak tomoni ${s} sm bo'lsa, yuzi x ni toping.`, f(s * s / 4) + '√3 sm²', [f(s * s) + '√3 sm²', f(s * s / 2) + '√3 sm²', f(3 * s) + ' sm²'], 'Yuz = a²√3/4.', dTriangle('iso', '60', '60', 'S'));
  });
  return qs;
}

function buildBurchakTomon() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('burchak-tomon-' + (qs.length + 1), q, a, e, ex, d));
  [[4, 6, 8], [5, 7, 10], [6, 9, 12]].forEach(([a, b, c]) => {
    add(`Uchburchak tomonlari ${a} sm, ${b} sm va ${c} sm bo'lsa, eng katta burchak qaysi tomon qarshisida?`, c + ' sm qarshisida', [a + ' sm qarshisida', b + ' sm qarshisida', 'HAMMASI TENG'], 'Katta tomon qarshisida katta burchak yotadi.', dTriangle('basic', a, b, c));
    add(`Tomonlari ${a}, ${b}, ${c} bo'lgan uchburchak mavjudmi?`, 'Ha', ['Yo\'q', 'Faqat to\'g\'ri burchakli', 'Aniqlab bo\'lmaydi'], 'Har ikki tomon yig\'indisi uchinchisidan katta: ' + (a + b) + ' > ' + c + '.', dTriangle('basic', a, b, c));
  });
  [[5, 9], [7, 12], [8, 15]].forEach(([a, b]) => {
    add(`Uchburchakning ikki tomoni ${a} sm va ${b} sm bo'lsa, uchinchi tomon x qanday oraliqda bo'lishi kerak?`, `${b - a} < x < ${a + b}`, [`x < ${b - a}`, `x > ${a + b}`, `x = ${a + b}`], 'Uchburchak tengsizligi: |a−b| < x < a+b.', dTriangle('basic', a, b, 'x'));
  });
  [30, 40, 50].forEach((a) => {
    add(`Uchburchakda ∠A = ${a}°, ∠B = ${a + 20}° bo'lsa, qaysi tomon eng uzun?`, 'AC', ['AB', 'BC', 'BARCHASI TENG'], 'Katta burchak qarshisidagi tomon uzunroq.', dTriangle('basic', a, a + 20, 'x'));
  });
  [60, 70, 80].forEach((a) => {
    add(`Tashqi burchak ${a}° bo'lsa, uzoqdagi ichki burchaklardan har biri undan kichikmi?`, 'Ha', ['Yo\'q', 'Teng', 'Faqat biri kichik'], 'Tashqi burchak uzoqdagi har bir ichki burchakdan katta.', dTriangle('exterior', a - 30, 'x', 'x'));
  });
  [[3, 4, 5], [6, 8, 10], [5, 12, 13]].forEach(([a, b, c]) => {
    add(`Tomonlari ${a}, ${b}, ${c} bo'lgan uchburchak qanday uchburchak?`, 'To\'g\'ri burchakli', ['O\'tkir burchakli', 'O\'tmas burchakli', 'Teng yonli'], a + '² + ' + b + '² = ' + c + '².', dTriangle('right', a, b, c));
  });
  [[18, 4, 6], [24, 7, 8], [30, 9, 11]].forEach(([p, a, b]) => {
    add(`Uchburchak perimetri ${p} sm, ikki tomoni ${a} sm va ${b} sm bo'lsa, uchinchi tomon x ni toping.`, (p - a - b) + ' sm', [(p - a) + ' sm', (p - b) + ' sm', (a + b) + ' sm'], 'Uchinchi tomon P − a − b.', dTriangle('basic', a, b, 'x'));
  });
  [40, 50, 70].forEach((a) => {
    add(`Uchburchakning ikki burchagi ${a}° dan bo'lsa, uchinchisi x ni toping.`, (180 - 2 * a) + '°', [a + '°', (2 * a) + '°', (90 - a) + '°'], 'Ikki teng burchak va uchinchisi 180° − 2a.', dTriangle('iso', a, a, 'x'));
  });
  [[3, 4, 5], [5, 6, 10], [7, 8, 14]].forEach(([a, b, c]) => {
    add(`Tomonlari ${a}, ${b}, ${c} bo'lgan uchburchakda ikki kichik tomon yig'indisi kattasidan kattami?`, 'Ha', ['Yo\'q', 'Teng', 'Aniqlab bo\'lmaydi'], 'Uchburchak tengsizligi bajarilishi kerak.', dTriangle('basic', a, b, c));
  });
  [[5, 9], [7, 12], [8, 15]].forEach(([a, b]) => {
    add(`Uchburchakning ikki tomoni ${a} sm va ${b} sm bo'lsa, uchinchi tomonning eng kichik butun qiymati x necha?`, (b - a + 1) + ' sm', [(b - a) + ' sm', (a + b) + ' sm', (b + 1) + ' sm'], '|a−b| < x bo\'lgani uchun eng kichik butun qiymat b−a+1.', dTriangle('basic', a, b, 'x'));
  });
  return qs;
}

function buildMenelay() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('menelay-cheva-' + (qs.length + 1), q, a, e, ex, d));
  [[2, 3], [3, 4], [1, 5]].forEach(([r, s]) => {
    add(`Menelay shartida (AF/FB)·(BD/DC)·(CE/EA) = 1. AF/FB = ${r}, BD/DC = ${s} bo'lsa, CE/EA ni toping.`, f(1 / (r * s)), [f(r * s), f(r + s), f(Math.abs(r - s))], 'Ko\'paytma 1 ga teng bo\'lishi kerak.', dCeva('menelaus', [r + '', s + '', 'x']));
  });
  [[2, 3], [4, 5], [3, 7]].forEach(([r, s]) => {
    add(`Cheva shartida (BD/DC)·(CE/EA)·(AF/FB) = 1. BD/DC = ${r}, CE/EA = ${s} bo'lsa, AF/FB ni toping.`, f(1 / (r * s)), [f(r * s), f(r / s), f(s / r)], 'Cheva ko\'paytmasi 1 ga teng.', dCeva('ceva', [r + '', s + '', 'x']));
  });
  [6, 10, 14].forEach((m) => {
    add(`Uchburchak medianasi ${m} sm bo'lsa, og'irlik markazi uni qanday nisbatda bo'ladi?`, '2:1', ['1:1', '3:1', '1:2'], 'Mediana og\'irlik markazida 2:1 nisbatda bo\'linadi.', dMedian(m, 'AG'));
  });
  [40, 60, 80].forEach((a) => {
    add(`Burchak bissektrisalari uchun Cheva ko'paytmasi qanchaga teng?`, '1', ['0', '2', 'a'], 'Har bir nisbat qo\'shni tomonlar nisbatiga teng, ko\'paytma qisqarib 1 bo\'ladi.', dCeva('ceva', [a + '°', 'x', '1']));
  });
  [[3, 4, 5], [5, 7, 9], [2, 6, 7]].forEach(([m, n, a]) => {
    add(`Stuart teoremasida tomon ${m + n}, bo'laklar ${m} va ${n}, bissektrisa ${a} bo'lsa, ko'paytma qaysi ifodaga teng?`, `${a}²·${m + n}`, [`${a}²·${m}`, `${a}²·${n}`, `${m}·${n}`], 'Stuart formulasi b·(m² + mn + n²) ko\'rinishida.', dCeva('menelaus', [m + '', n + '', a + '']));
  });
  [30, 45, 60].forEach((a) => {
    add(`Karno teoremasida uchburchak ichidagi nuqtadan tomonlarga tushirilgan perpendikulyarlar yig'indisi balandlikka teng bo'lsa, bu nuqta qayerda?`, 'Ichki nuqta', ['Tepalikda', 'Atrof chiziqda', 'Tashqarida'], 'Karno teoremasi ichki nuqta uchun o\'rinli.', dCeva('ceva', [a + '°', 'x', 'P']));
  });
  [[2, 5], [3, 7], [4, 9]].forEach(([r, s]) => {
    add(`Menelay shartida AF/FB = ${r}, CE/EA = ${s} bo'lsa, BD/DC ni toping.`, f(1 / (r * s)), [f(r * s), f(r / s), f(s / r)], 'Ko\'paytma 1 bo\'lishi kerak.', dCeva('menelaus', ['x', s + '', r + '']));
  });
  [[12, 1, 2], [20, 2, 3], [28, 3, 4]].forEach(([l, r, s]) => {
    add(`BC = ${l} sm va BD:DC = ${r}:${s} bo'lsa, BD ni toping.`, f(l * r / (r + s)) + ' sm', [f(l * s / (r + s)) + ' sm', f(l / 2) + ' sm', f(l - r) + ' sm'], 'BD = BC·r/(r+s).', dCeva('ceva', [r + ':' + s, 'x', l + '']));
  });
  [[2, 3, 6], [3, 4, 12], [2, 5, 10]].forEach(([r, s, t]) => {
    add(`Nisbatlar ${r}, ${s}, ${t} bo'lsa, Cheva sharti bajariladimi?`, r * s * t === 1 ? 'Ha' : 'Yo\'q', [r * s * t === 1 ? 'Yo\'q' : 'Ha', 'Faqat medianada', 'Faqat bissektorisada'], 'Ko\'paytma 1 ga teng bo\'lishi shart.', dCeva('ceva', [r + '', s + '', t + '']));
  });
  [8, 12, 16].forEach((m) => {
    add(`AD mediana bo'lsa, BD va DC qanday munosabatda?`, 'Teng', ['BD = 2DC', 'DC = 2BD', 'Noma\'lum'], 'Mediana tomonni teng ikkiga bo\'ladi.', dMedian(m, 'AD'));
  });
  return qs;
}

function buildOxshashlik() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('oxshashlik-' + (qs.length + 1), q, a, e, ex, d));
  [[2, 6], [3, 9], [4, 10]].forEach(([k, side]) => {
    add(`ABC ~ A'B'C' va o'xshashlik koeffitsiyenti k = ${k}. AB = ${side} bo'lsa, A'B' ni toping.`, (k * side) + '', [f(side / k), f(side + k), f(side * 2)], 'Mos tomonlar k ga ko\'paytiriladi.', dSimilar(k, side + '', k * side + ''));
    add(`O'xshash uchburchaklar perimetrlari nisbati ${k} bo'lsa, ularning mos tomonlari nisbati nechaga teng?`, k + '', [f(k * k), f(1 / k), f(k + 1)], 'Perimetrlar nisbati o\'xshashlik koeffitsiyentiga teng.', dSimilar(k, 'P', 'P′'));
    add(`O'xshashlik koeffitsiyenti ${k} bo'lsa, yuzlar nisbati qanchaga teng?`, (k * k) + '', [k + '', f(k + 1), f(k * k + 1)], 'Yuzlar nisbati k².', dSimilar(k, 'S', 'S′'));
  });
  [40, 55, 70].forEach((a) => {
    add(`ABC va A'B'C' o'xshash, ∠A = ${a}° bo'lsa, ∠A' ni toping.`, a + '°', [(180 - a) + '°', (a / 2) + '°', (90 - a) + '°'], 'O\'xshash uchburchaklarda mos burchaklar teng.', dSimilar('1', a + '°', a + '°'));
  });
  [[3, 12], [4, 20], [5, 25]].forEach(([part, whole]) => {
    add(`Uchburchakning DE kesmi BC ga parallel, AD/AB = ${part}/${whole} bo'lsa, DE/BC ni toping.`, f(part / whole), [f(whole / part), f(part / (whole - part)), f(part * whole)], 'Parallel kesma o\'xshash uchburchak hosil qiladi.', dSimilar(f(whole / part), part + '', 'x'));
  });
  [6, 9, 12].forEach((h) => {
    add(`To'g'ri burchakli uchburchakda gipotenuza ${h} bo'lsa, unga tushirilgan o'rta chiziq uzunligi x ni toping.`, f(h / 2), [h + '', f(h / 3), f(h / 4)], 'O\'rta chiziq asosning yarmiga teng.', dTrig('a', 'b', h + ''));
  });
  [[2, 3, 8], [3, 5, 12], [4, 7, 16]].forEach(([a, b, s]) => {
    add(`Ikki o'xshash uchburchakda mos tomonlar ${a} va ${b}, ikkinchi uchburchak perimetri ${s} bo'lsa, birinchisi perimetri x ni toping.`, f(s * a / b), [f(s * b / a), f(s / (a + b)), f(s - a)], 'Perimetr tomonlar nisbatiga proporsional.', dSimilar(f(b / a), a + '', f(s * a / b) + ''));
  });
  [[2, 12], [3, 18], [4, 24]].forEach(([k, side]) => {
    add(`O'xshashlik koeffitsiyenti ${k} va A'B' = ${side} bo'lsa, mos tomon AB ni toping.`, f(side / k), [side * k + '', f(side + k), f(side - k)], 'AB = A\'B\'/k.', dSimilar(k, f(side / k) + '', side + ''));
  });
  [2, 3, 5].forEach((k) => {
    add(`Ikki o'xshash uchburchakning mos tomonlari nisbati ${k} bo'lsa, yuzlari nisbati qancha?`, k * k + '', [k + '', f(k + 1), f(k * k + 1)], 'Yuzlar nisbati k².', dSimilar(k, 'S', k * k + ''));
  });
  [10, 14, 18].forEach((l) => {
    add(`D va E tomonlarning o'rtalari bo'lsa, DE ∥ BC va BC = ${l} sm bo'lsa, DE ni toping.`, f(l / 2) + ' sm', [l + ' sm', f(l / 3) + ' sm', f(l / 4) + ' sm'], 'O\'rta chiziq asosning yarmiga teng.', dSimilar('2', f(l / 2) + '', l + ''));
  });
  return qs;
}

function buildTogriBurchakli() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('togri-burchakli-' + (qs.length + 1), q, a, e, ex, d));
  [[3, 4], [6, 8], [5, 12]].forEach(([a, b]) => {
    add(`To'g'ri burchakli uchburchak katetlari ${a} va ${b} bo'lsa, gipotenuzasi x ni toping.`, Math.sqrt(a * a + b * b) + '', [(a + b) + '', (a * b) + '', (b - a) + ''], 'Pifagor teoremasi: c² = a² + b².', dTrig(a + '', b + '', 'x'));
    add(`Gipotenuza ${Math.sqrt(a * a + b * b)}, katet ${a} bo'lsa, ikkinchi katet x ni toping.`, b + '', [a + '', (a + b) + '', (b * 2) + ''], 'Pifagor teoremasidan c² − a² = b².', dTrig(a + '', 'x', Math.sqrt(a * a + b * b) + ''));
  });
  [10, 20, 30].forEach((h) => {
    add(`To'g'ri burchakli uchburchakda 30° qarshisidagi katet ${h/2} bo'lsa, gipotenuzasi x ni toping.`, h + '', [h / 2 + '', h * 2 + '', f(h * Math.sqrt(3)) + ''], '30° qarshisidagi katet gipotenuzaning yarmi.', dTrig(h / 2 + '', 'b', h + ''));
    add(`Gipotenuza ${h} bo'lsa, unga tushirilgan mediana x ni toping.`, f(h / 2), [h + '', f(h / 3), f(h / 4)], 'To\'g\'ri burchakli uchburchakda mediana gipotenuzaning yarmiga teng.', dTrig('a', 'b', h + ''));
  });
  [4, 6, 8].forEach((a) => {
    add(`Teng yonli to'g'ri burchakli uchburchak yoni ${a} bo'lsa, gipotenuzasi x ni toping.`, f(a) + '√2', [(2 * a) + '', (a * a) + '', f(a / 2) + '√2'], 'Gipotenuza a√2.', dTrig(a + '', a + '', 'x'));
    add(`Katetlari ${a} va ${a} bo'lgan uchburchak yuzi x ni toping.`, f(a * a / 2), [a * a + '', (2 * a + 1) + '', (a + 1) + ''], 'Yuz = ab/2.', dTrig(a + '', a + '', 'x'));
  });
  [[30, 60], [45, 45], [20, 70]].forEach(([a, b]) => {
    add(`To'g'ri burchakli uchburchakda ∠A = ${a}°, ∠B = ${b}° bo'lsa, sin A qaysi ifodaga teng?`, `cos ${b}°`, [`sin ${b}°`, `tan ${a}°`, '1'], 'To\'ldiruvchi burchaklar uchun sin A = cos B.', dTrig('a', 'b', 'c'));
  });
  [[3, 4, 5], [5, 12, 13], [8, 15, 17]].forEach(([a, b, c]) => {
    add(`Katetlari ${a} va ${b}, gipotenuzasi ${c} bo'lsa, katta o'tkir burchak sinusini toping.`, f(Math.max(a, b) / c), [f(Math.min(a, b) / c), f(a / b), f(c / b)], 'Sin = qarshidagi katet / gipotenuza.', dTrig(a + '', b + '', c + ''));
  });
  [[4, 9], [9, 16], [1, 25]].forEach(([m, n]) => {
    add(`Gipotenuza balandlik bilan ${m} va ${n} bo'laklarga bo'lingan bo'lsa, balandlik x ni toping.`, Math.sqrt(m * n) + '', [m + n + '', Math.sqrt(m) + '', Math.sqrt(n) + ''], 'Balandlik x² = mn.', dTrig('m', 'n', 'x'));
  });
  [[3, 4, 5], [5, 12, 13], [8, 15, 17]].forEach(([a, b, c]) => {
    add(`Katetlari ${a} va ${b}, gipotenuzasi ${c} bo'lsa, ∠A uchun cos ni toping.`, f(b / c), [f(a / c), f(b / a), f(c / b)], 'Cos = yondosh katet / gipotenuza.', dTrig(a + '', b + '', c + ''));
  });
  return qs;
}

function buildAylana() {
  const qs = [];
  const add = (q, a, e, ex, d) => qs.push(make('aylana-yuz-' + (qs.length + 1), q, a, e, ex, d));
  [60, 80, 120].forEach((a) => {
    add(`Aylanada markaziy burchak ${a}° bo'lsa, uning qarshisidagi yoy o'lchami x ni toping.`, a + '°', [f(a + 20) + '°', f(a + 40) + '°', f(a / 2) + '°'], 'Markaziy burchak yoy o\'lchamiga teng.', dCircle('inscribed', a, 'x'));
    add(`Yoy o'lchami ${a}° bo'lsa, shu yoyga tayangan yozilgan burchak x ni toping.`, f(a / 2) + '°', [a + '°', f(2 * a) + '°', f(a + 10) + '°'], 'Yozilgan burchak yoyning yarmiga teng.', dCircle('inscribed', a, 'x'));
  });
  [5, 8, 10].forEach((r) => {
    add(`Aylana radiusi ${r} sm bo'lsa, uning uzunligi x ni toping.`, (2 * r) + 'π sm', [r + 'π sm', (r * r) + 'π sm', (4 * r) + 'π sm'], 'Aylana uzunligi 2πr.', dCircle('tangent', r + '', 'x'));
    add(`Radiusi ${r} sm bo'lgan doira yuzi x ni toping.`, (r * r) + 'π sm²', [(2 * r) + 'π sm²', (r * r) + ' sm²', (4 * r) + 'π sm²'], 'Doira yuzi πr².', dCircle('tangent', r + '', 'S'));
    add(`Radiusi ${r} sm, markaziy burchagi 90° bo'lgan sektor yuzi x ni toping.`, f(r * r / 4) + 'π sm²', [(r * r) + 'π sm²', f(r * r / 2) + 'π sm²', f(r * r / 4 + 1) + 'π sm²'], 'Sektor yuzi (90/360)·πr².', dCircle('inscribed', 90, 'S'));
  });
  [[4, 6], [5, 8], [3, 12]].forEach(([a, b]) => {
    add(`Aylana ichidagi kesishuvchi vatarlarda PA = ${a}, PB = ${b}, PC = ${a} bo'lsa, PD ni toping.`, b + '', [a + '', a + b + '', a * b + ''], 'Kesishuvchi vatarlar teoremasi: PA·PB = PC·PD.', dCircle('chords', a + '', 'x'));
  });
  [[6, 8], [9, 12], [5, 10]].forEach(([t, s]) => {
    add(`Aylanaga o'tkazilgan urinma ${t} sm, kesuvchi tashqi qismi ${s} sm bo'lsa, seli toping.`, f((t * t) / s + s), [t + s + '', t + '', f(t * s) + ''], 'Urinma-kesuvchi teoremasi: t² = s(s + sel).', dCircle('tangent', t + '', 'x'));
  });
  [30, 60, 90].forEach((a) => {
    add(`Radiusi 6 sm bo'lgan aylana yoyining uzunligi markaziy burchak ${a}° bo'lganda toping.`, f(12 * a / 360) + 'π sm', [f(6 * a / 360) + 'π sm', f(24 * a / 360) + 'π sm', '6π sm'], 'Yoy uzunligi (α/360)·2πr.', dCircle('inscribed', a, 'l'));
  });
  [45, 120, 180].forEach((a) => {
    add(`Radiusi 6 sm, markaziy burchagi ${a}° bo'lgan yoy uzunligi x ni toping.`, f(12 * a / 360) + 'π sm', [f(6 * a / 360) + 'π sm', f(12 * a / 360 + 2) + 'π sm', '24π sm'], 'Yoy uzunligi (α/360)·2πr.', dCircle('inscribed', a, 'l'));
  });
  [100, 140, 200].forEach((arcDeg) => {
    add(`Yoy o'lchami ${arcDeg}° bo'lsa, shu yoyga tayangan yozilgan burchak x ni toping.`, f(arcDeg / 2) + '°', [arcDeg + '°', f(2 * arcDeg) + '°', f(arcDeg + 40) + '°'], 'Yozilgan burchak yoyning yarmiga teng.', dCircle('inscribed', arcDeg, 'x'));
  });
  return qs;
}

addTopic('burchaklar', '1-mavzu: Burchaklar', 'PUZA Açılar DI TEST uslubi: mos, almashinma va qo\'shni burchaklar, bissektrisa', buildBurchaklar());
addTopic('parallel', '2-mavzu: Parallel va perpendikulyar chiziqlar', 'PUZA Açılar va Açı-Kenar DI TEST uslubi: parallel chiziqlar va kesuvchi', buildParallel());
addTopic('uchburchak-burchaklari', '3-mavzu: Uchburchak turlari va burchaklari', 'PUZA Üçgende Açılar DI TEST uslubi: ichki va tashqi burchaklar', buildUchburchak());
addTopic('bissektrisa', '4-mavzu: Burchak bissektrisalari va maxsus nuqtalar', 'PUZA Açıortay va Kenarortay DI TEST uslubi', buildBissektrisa());
addTopic('muntazam-kvadrat', '5-mavzu: Muntazam uchburchak va kvadrat', 'PUZA İkizkenar-Eşkenar Üçgen va Kare DI TEST uslubi', buildMuntazam());
addTopic('burchak-tomon', '6-mavzu: Burchak-tomon munosabatlari', 'PUZA Açı-Kenar Bağıntıları DI TEST uslubi', buildBurchakTomon());
addTopic('menelay-cheva', '7-mavzu: Menelay, Cheva, Karno va Stuart', 'PUZA klassik teoremalar uslubi: nisbatlar va chiziqlar', buildMenelay());
addTopic('oxshashlik', '8-mavzu: O\'xshash uchburchaklar', 'PUZA Üçgende Benzerlik DI TEST uslubi', buildOxshashlik());
addTopic('togri-burchakli', '9-mavzu: To\'g\'ri burchakli uchburchak va trigonometriya', 'PUZA Dik Üçgen DI TEST uslubi: Pifagor va trigonometriya', buildTogriBurchakli());
addTopic('aylana-yuz', '10-mavzu: Aylana, doira, yuz va aralash testlar', 'PUZA Çemberde Açı, Çemberde Uzunluk va Dairede Alan DI TEST uslubi', buildAylana());
