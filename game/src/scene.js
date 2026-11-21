// Whale Cottage — hand-drawn SVG scene builder.
// buildScene(variant) returns the inner SVG markup of one 600 x 400 panel.
// variant 0 is the original (left panel); variant 1 is the changed copy
// (right panel) with the seven differences from differences.js applied.
// Nothing here is random: the same variant always draws the same picture.
'use strict';

function buildScene(variant) {
  const changed = variant === 1;
  const parts = [];

  // ---- room shell -------------------------------------------------------
  parts.push('<rect x="0" y="0" width="600" height="300" fill="#f6e3c5"/>');
  parts.push('<rect x="0" y="300" width="600" height="100" fill="#b98a5e"/>');
  parts.push('<rect x="0" y="292" width="600" height="10" fill="#8a5a34"/>');
  // floor planks
  parts.push('<line x1="0" y1="330" x2="600" y2="330" stroke="#a1764a" stroke-width="2"/>');
  parts.push('<line x1="0" y1="362" x2="600" y2="362" stroke="#a1764a" stroke-width="2"/>');
  parts.push('<line x1="150" y1="300" x2="150" y2="400" stroke="#a1764a" stroke-width="2"/>');
  parts.push('<line x1="430" y1="300" x2="430" y2="400" stroke="#a1764a" stroke-width="2"/>');

  // ---- window with night sky -------------------------------------------
  parts.push('<rect x="28" y="22" width="156" height="136" rx="6" fill="#7a4a21"/>');
  parts.push('<rect x="38" y="32" width="136" height="116" fill="#233861"/>');
  // stars (fixed positions)
  const stars = [[55, 48], [75, 130], [150, 45], [160, 120], [120, 135], [60, 95], [145, 88]];
  for (const [sx, sy] of stars) {
    parts.push(`<circle cx="${sx}" cy="${sy}" r="2.5" fill="#ffe9a8"/>`);
    parts.push(`<circle cx="${sx}" cy="${sy}" r="5.5" fill="#ffe9a8" opacity="0.25"/>`);
  }
  // moon: crescent in the original, full in the changed panel
  if (!changed) {
    parts.push('<circle cx="95" cy="78" r="26" fill="#ffedb0"/>');
    parts.push('<circle cx="106" cy="72" r="23" fill="#233861"/>');
  } else {
    parts.push('<circle cx="95" cy="78" r="26" fill="#ffedb0"/>');
    parts.push('<circle cx="87" cy="70" r="5" fill="#e8c97e"/>');
    parts.push('<circle cx="103" cy="86" r="4" fill="#e8c97e"/>');
    parts.push('<circle cx="100" cy="66" r="3" fill="#e8c97e"/>');
  }
  // window cross bars and sill
  parts.push('<rect x="102" y="32" width="6" height="116" fill="#7a4a21"/>');
  parts.push('<rect x="38" y="86" width="136" height="6" fill="#7a4a21"/>');
  parts.push('<rect x="22" y="158" width="168" height="10" rx="3" fill="#8a5a34"/>');
  // curtains
  parts.push('<rect x="14" y="18" width="18" height="146" rx="8" fill="#d96a5f"/>');
  parts.push('<rect x="180" y="18" width="18" height="146" rx="8" fill="#d96a5f"/>');

  // ---- wall clock --------------------------------------------------------
  const clock = clockHands(changed ? 5 : 3, changed ? 30 : 0);
  parts.push('<circle cx="300" cy="68" r="40" fill="#fff8e7" stroke="#7a4a21" stroke-width="6"/>');
  parts.push('<circle cx="300" cy="68" r="32" fill="none" stroke="#d9c39a" stroke-width="1.5"/>');
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    const x1 = 300 + Math.sin(a) * 33;
    const y1 = 68 - Math.cos(a) * 33;
    const x2 = 300 + Math.sin(a) * 28;
    const y2 = 68 - Math.cos(a) * 28;
    parts.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#7a4a21" stroke-width="2"/>`);
  }
  parts.push(`<line x1="300" y1="68" x2="${clock.hourX}" y2="${clock.hourY}" stroke="#33302b" stroke-width="4" stroke-linecap="round"/>`);
  parts.push(`<line x1="300" y1="68" x2="${clock.minuteX}" y2="${clock.minuteY}" stroke="#33302b" stroke-width="3" stroke-linecap="round"/>`);
  parts.push('<circle cx="300" cy="68" r="4" fill="#d94f3d"/>');

  // ---- bookshelf ---------------------------------------------------------
  parts.push('<rect x="428" y="22" width="144" height="158" rx="4" fill="#8a5a34"/>');
  parts.push('<rect x="436" y="30" width="128" height="62" fill="#a9713f"/>');
  parts.push('<rect x="436" y="100" width="128" height="62" fill="#a9713f"/>');
  parts.push('<rect x="436" y="92" width="128" height="8" fill="#7a4a21"/>');
  parts.push('<rect x="436" y="162" width="128" height="8" fill="#7a4a21"/>');
  // top shelf books; the changed panel drops the third book, leaving a gap
  const bookColors = ['#d94f3d', '#3d7bd9', '#4da96b', '#e8a13d', '#8a5fc0', '#4db8a9'];
  const bookWidths = [18, 22, 16, 20, 18, 22];
  let bx = 440;
  for (let i = 0; i < bookColors.length; i++) {
    if (changed && i === 2) {
      bx += bookWidths[i] + 2; // empty slot where the book was
      continue;
    }
    parts.push(`<rect x="${bx}" y="48" width="${bookWidths[i]}" height="44" rx="2" fill="${bookColors[i]}"/>`);
    parts.push(`<rect x="${bx}" y="54" width="${bookWidths[i]}" height="3" fill="#ffffff" opacity="0.35"/>`);
    bx += bookWidths[i] + 2;
  }
  // bottom shelf books (same in both panels)
  const bottomColors = ['#e8a13d', '#4da96b', '#d94f3d', '#3d7bd9', '#8a5fc0'];
  const bottomWidths = [20, 16, 22, 18, 20];
  let cx = 442;
  for (let i = 0; i < bottomColors.length; i++) {
    parts.push(`<rect x="${cx}" y="118" width="${bottomWidths[i]}" height="44" rx="2" fill="${bottomColors[i]}"/>`);
    cx += bottomWidths[i] + 3;
  }
  // a small potted succulent on the shelf's top edge
  parts.push('<rect x="520" y="8" width="26" height="14" rx="3" fill="#c96f4a"/>');
  parts.push('<circle cx="533" cy="6" r="7" fill="#4da96b"/>');

  // ---- framed whale picture ----------------------------------------------
  parts.push('<rect x="205" y="128" width="190" height="96" rx="4" fill="#7a4a21"/>');
  parts.push('<rect x="213" y="136" width="174" height="80" fill="#7fc4d8"/>');
  // waves
  parts.push('<path d="M213 196 Q240 188 267 196 T321 196 T387 196" fill="none" stroke="#5aa8c4" stroke-width="4" stroke-linecap="round"/>');
  parts.push('<path d="M213 208 Q240 201 267 208 T321 208 T387 208" fill="none" stroke="#5aa8c4" stroke-width="3" stroke-linecap="round"/>');
  // the whale: drawn facing right, flipped when the original faces left
  const dir = changed ? 1 : -1;
  parts.push(`<g transform="translate(300 172) scale(${dir} 1)">`);
  parts.push('<path d="M-52 0 Q-52 -22 -18 -24 Q22 -26 44 -8 Q52 0 44 8 Q22 22 -18 20 Q-52 18 -52 0 Z" fill="#5b7fa6"/>');
  parts.push('<path d="M44 -8 L62 -22 L60 -4 L66 6 L44 8 Z" fill="#5b7fa6"/>');
  parts.push('<path d="M-52 0 Q-52 -22 -18 -24 Q22 -26 44 -8 Q30 2 0 4 Q-30 6 -52 0 Z" fill="#7fa3c9"/>');
  parts.push('<path d="M-30 18 Q-18 30 -6 18" fill="none" stroke="#3d5a7a" stroke-width="3" stroke-linecap="round"/>');
  parts.push('<circle cx="28" cy="-10" r="3.5" fill="#1f2a33"/>');
  parts.push('<path d="M-8 -20 Q-2 -30 6 -24" fill="none" stroke="#9fc6dd" stroke-width="2.5" stroke-linecap="round"/>');
  parts.push('</g>');

  // ---- potted plant (bottom right) ---------------------------------------
  parts.push('<path d="M492 312 L548 312 L542 360 L498 360 Z" fill="#c96f4a"/>');
  parts.push('<rect x="488" y="304" width="64" height="12" rx="4" fill="#b25a38"/>');
  // stems and leaves
  parts.push('<path d="M520 304 L520 268" stroke="#3d7a44" stroke-width="4" stroke-linecap="round"/>');
  parts.push('<path d="M520 290 Q500 272 492 258" fill="none" stroke="#3d7a44" stroke-width="4" stroke-linecap="round"/>');
  parts.push('<path d="M520 290 Q540 272 548 258" fill="none" stroke="#3d7a44" stroke-width="4" stroke-linecap="round"/>');
  parts.push('<ellipse cx="498" cy="276" rx="12" ry="6" fill="#4da96b" transform="rotate(-35 498 276)"/>');
  parts.push('<ellipse cx="542" cy="276" rx="12" ry="6" fill="#4da96b" transform="rotate(35 542 276)"/>');
  parts.push('<ellipse cx="520" cy="262" rx="6" ry="12" fill="#4da96b"/>');
  // flowers: 3 in the original, 5 in the changed panel
  const flowers = [
    [490, 255, '#f2a0b5'],
    [520, 240, '#f2a0b5'],
    [550, 255, '#f2a0b5'],
    [478, 275, '#f7c65c'],
    [562, 275, '#f7c65c'],
  ];
  const flowerCount = changed ? 5 : 3;
  for (let i = 0; i < flowerCount; i++) {
    const [fx, fy, fc] = flowers[i];
    for (let p = 0; p < 5; p++) {
      const a = (p * 72 * Math.PI) / 180;
      const px = fx + Math.cos(a) * 7;
      const py = fy + Math.sin(a) * 7;
      parts.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="${fc}"/>`);
    }
    parts.push(`<circle cx="${fx}" cy="${fy}" r="4.5" fill="#fff3c4"/>`);
  }

  // ---- table with teapot (bottom left) -----------------------------------
  parts.push('<rect x="55" y="298" width="170" height="12" rx="3" fill="#8a5a34"/>');
  parts.push('<rect x="66" y="310" width="10" height="60" fill="#7a4a21"/>');
  parts.push('<rect x="204" y="310" width="10" height="60" fill="#7a4a21"/>');
  // cups
  parts.push('<rect x="182" y="284" width="26" height="14" rx="3" fill="#fff8e7"/>');
  parts.push('<path d="M208 287 Q216 291 208 295" fill="none" stroke="#fff8e7" stroke-width="3"/>');
  parts.push('<rect x="92" y="286" width="24" height="12" rx="3" fill="#d9e8f2"/>');
  parts.push('<path d="M92 289 Q84 292 92 295" fill="none" stroke="#d9e8f2" stroke-width="3"/>');
  // teapot body, spout, handle, lid
  parts.push('<path d="M112 278 Q104 268 112 262" fill="none" stroke="#3d7bd9" stroke-width="7" stroke-linecap="round"/>');
  parts.push('<ellipse cx="140" cy="280" rx="30" ry="19" fill="#3d7bd9"/>');
  parts.push('<path d="M170 274 Q184 268 186 258" fill="none" stroke="#3d7bd9" stroke-width="7" stroke-linecap="round"/>');
  parts.push('<path d="M118 264 Q140 252 162 264" fill="#2f63ad"/>');
  parts.push('<circle cx="140" cy="252" r="7" fill="' + (changed ? '#3d7bd9' : '#d94f3d') + '"/>');
  parts.push('<ellipse cx="132" cy="274" rx="7" ry="4" fill="#ffffff" opacity="0.35" transform="rotate(-20 132 274)"/>');

  // ---- rug and sleeping cat (bottom centre) ------------------------------
  parts.push('<ellipse cx="300" cy="362" rx="122" ry="22" fill="#c96f5a"/>');
  parts.push('<ellipse cx="300" cy="362" rx="100" ry="16" fill="#d98a76"/>');
  parts.push('<ellipse cx="300" cy="362" rx="78" ry="11" fill="#c96f5a"/>');
  // tail: raised in the original, resting flat in the changed panel
  if (!changed) {
    parts.push('<path d="M340 352 Q366 330 358 306" fill="none" stroke="#f2a541" stroke-width="8" stroke-linecap="round"/>');
  } else {
    parts.push('<path d="M340 352 Q368 360 386 354" fill="none" stroke="#f2a541" stroke-width="8" stroke-linecap="round"/>');
  }
  // curled body, head, ears, closed eye, whiskers
  parts.push('<ellipse cx="300" cy="352" rx="42" ry="16" fill="#f2a541"/>');
  parts.push('<path d="M272 344 Q286 336 300 344" fill="none" stroke="#d98a2b" stroke-width="2.5" stroke-linecap="round"/>');
  parts.push('<path d="M282 360 Q296 354 310 360" fill="none" stroke="#d98a2b" stroke-width="2.5" stroke-linecap="round"/>');
  parts.push('<circle cx="262" cy="344" r="14" fill="#f2a541"/>');
  parts.push('<path d="M252 334 L250 322 L260 330 Z" fill="#f2a541"/>');
  parts.push('<path d="M268 330 L274 320 L276 332 Z" fill="#f2a541"/>');
  parts.push('<path d="M252 334 L250 322 L260 330 Z" fill="#e08a5a" opacity="0.6"/>');
  parts.push('<path d="M254 344 Q258 346 262 344" fill="none" stroke="#7a4a21" stroke-width="2" stroke-linecap="round"/>');
  parts.push('<path d="M248 348 L238 346 M248 352 L239 353" stroke="#c9a58a" stroke-width="1.5" stroke-linecap="round"/>');

  return parts.join('');
}

// Clock hand endpoints for a given time, from 12 o'clock, clockwise.
function clockHands(hour, minute) {
  const hourAngle = (((hour % 12) + minute / 60) * 30 * Math.PI) / 180;
  const minuteAngle = (minute * 6 * Math.PI) / 180;
  return {
    hourX: (300 + Math.sin(hourAngle) * 20).toFixed(1),
    hourY: (68 - Math.cos(hourAngle) * 20).toFixed(1),
    minuteX: (300 + Math.sin(minuteAngle) * 29).toFixed(1),
    minuteY: (68 - Math.cos(minuteAngle) * 29).toFixed(1),
  };
}
