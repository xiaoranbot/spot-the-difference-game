// Whale Cottage — the seven differences between the two panels.
// Coordinates are in the 600 x 400 panel space shared by both SVGs.
// Each difference has a centre point and a hit radius in panel units.
'use strict';

const DIFFERENCES = [
  {
    id: 'moon',
    name: 'The moon',
    hint: 'Look up at the night sky through the window.',
    x: 95,
    y: 78,
    r: 32,
  },
  {
    id: 'tail',
    name: "The cat's tail",
    hint: 'The sleeping cat on the rug — check its tail.',
    x: 362,
    y: 342,
    r: 30,
  },
  {
    id: 'knob',
    name: 'The teapot knob',
    hint: 'The little knob on top of the teapot changed colour.',
    x: 140,
    y: 252,
    r: 26,
  },
  {
    id: 'book',
    name: 'The missing book',
    hint: 'Count the books on the top shelf.',
    x: 486,
    y: 68,
    r: 26,
  },
  {
    id: 'clock',
    name: 'The clock hands',
    hint: 'What time does the wall clock show?',
    x: 300,
    y: 68,
    r: 42,
  },
  {
    id: 'flowers',
    name: 'The flowers',
    hint: 'How many blooms does the potted plant have?',
    x: 520,
    y: 255,
    r: 36,
  },
  {
    id: 'whale',
    name: 'The whale in the picture',
    hint: 'The whale in the framed picture turned around.',
    x: 300,
    y: 176,
    r: 38,
  },
];

const TOTAL_DIFFERENCES = DIFFERENCES.length;
