const SVG_DEFS = '<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="currentColor"/></marker></defs>';

const POSITION_SVGS = {
  pa: '<rect x="35" y="75" width="190" height="18" class="metal"/><line x1="65" y1="68" x2="195" y2="68" class="weld"/><line x1="130" y1="25" x2="115" y2="62" class="torch"/><line x1="80" y1="45" x2="175" y2="45" class="arrow"/>',
  pc: '<rect x="115" y="20" width="20" height="90" class="metal"/><line x1="105" y1="35" x2="105" y2="95" class="weld"/><line x1="55" y1="60" x2="98" y2="60" class="torch"/><line x1="80" y1="35" x2="80" y2="95" class="arrow"/>',
  pf: '<rect x="120" y="20" width="18" height="95" class="metal"/><line x1="110" y1="90" x2="110" y2="35" class="weld"/><line x1="60" y1="92" x2="102" y2="78" class="torch"/><line x1="85" y1="96" x2="85" y2="35" class="arrow"/>',
  pg: '<rect x="120" y="20" width="18" height="95" class="metal"/><line x1="110" y1="35" x2="110" y2="90" class="weld"/><line x1="60" y1="42" x2="102" y2="55" class="torch"/><line x1="85" y1="35" x2="85" y2="96" class="arrow"/>',
  pe: '<rect x="35" y="25" width="190" height="18" class="metal"/><line x1="65" y1="52" x2="195" y2="52" class="weld"/><line x1="130" y1="108" x2="115" y2="60" class="torch"/><line x1="80" y1="75" x2="175" y2="75" class="arrow"/>'
};

const FASE_SVGS = {
  none: '<rect x="45" y="72" width="75" height="28" class="metal"/><rect x="140" y="72" width="75" height="28" class="metal"/><path d="M118 70 Q130 56 142 70" fill="none" class="weld"/>',
  optional: '<polygon points="45,72 104,72 120,100 45,100" class="metal"/><polygon points="156,72 215,72 215,100 140,100" class="metal"/><path d="M105 70 Q130 46 155 70" fill="none" class="weld"/>',
  recommended: '<polygon points="45,62 96,62 122,105 45,105" class="metal"/><polygon points="164,62 215,62 215,105 138,105" class="metal"/><path d="M104 72 Q130 44 156 72" fill="none" class="weld"/><path d="M112 88 Q130 72 148 88" fill="none" class="weld"/>',
  multilayer: '<polygon points="45,55 92,55 122,110 45,110" class="metal"/><polygon points="168,55 215,55 215,110 138,110" class="metal"/><path d="M118 101 Q130 92 142 101" fill="none" class="weld"/><path d="M110 83 Q130 66 150 83" fill="none" class="weld"/><path d="M100 63 Q130 38 160 63" fill="none" class="weld"/>'
};

function svgBox(content) {
  return `<svg class="svgbox" viewBox="0 0 260 130" role="img" aria-hidden="true">${SVG_DEFS}${content}</svg>`;
}

function card(title, description, svg) {
  return `<div class="visual-card"><strong>${title}</strong><p class="small">${description}</p>${svg}</div>`;
}

export function renderOutputVisuals({ position, positionLabel, fase }) {
  const target = document.getElementById('outputVisuals');
  if (!target) return;

  target.innerHTML = [
    card(positionLabel || 'Schweißposition', 'Skizze zur gewählten Position.', svgBox(POSITION_SVGS[position] || POSITION_SVGS.pa)),
    card('Nahtvorbereitung / Fase', fase.text, svgBox(FASE_SVGS[fase.visual] || FASE_SVGS.none))
  ].join('');
}
