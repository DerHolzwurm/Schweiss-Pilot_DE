const SVG_DEFS = `
  <defs>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,7 L6,3.5 z" fill="#34d399"/>
    </marker>
  </defs>`;

const POSITION_SVGS = {
  pa: '<rect x="35" y="78" width="190" height="18" class="metal"/><line x1="62" y1="68" x2="148" y2="68" class="weld"/><circle cx="150" cy="68" r="4" class="arc"/><line x1="182" y1="26" x2="152" y2="64" class="torch"/><line x1="62" y1="45" x2="185" y2="45" class="arrow"/>',
  pc: '<rect x="126" y="20" width="20" height="95" class="metal"/><line x1="116" y1="34" x2="116" y2="64" class="weld"/><circle cx="116" cy="66" r="4" class="arc"/><line x1="58" y1="66" x2="112" y2="66" class="torch"/><line x1="92" y1="34" x2="92" y2="100" class="arrow"/>',
  pf: '<rect x="126" y="20" width="20" height="95" class="metal"/><line x1="116" y1="100" x2="116" y2="68" class="weld"/><circle cx="116" cy="66" r="4" class="arc"/><line x1="60" y1="92" x2="112" y2="68" class="torch"/><line x1="88" y1="100" x2="88" y2="34" class="arrow"/>',
  pg: '<rect x="126" y="20" width="20" height="95" class="metal"/><line x1="116" y1="34" x2="116" y2="64" class="weld"/><circle cx="116" cy="66" r="4" class="arc"/><line x1="60" y1="42" x2="112" y2="64" class="torch"/><line x1="88" y1="34" x2="88" y2="100" class="arrow"/>',
  pe: '<rect x="35" y="28" width="190" height="18" class="metal"/><line x1="62" y1="56" x2="148" y2="56" class="weld"/><circle cx="150" cy="56" r="4" class="arc"/><line x1="182" y1="106" x2="152" y2="60" class="torch"/><line x1="62" y1="82" x2="185" y2="82" class="arrow"/>'
};

const FASE_SVGS = {
  none: '<rect x="45" y="72" width="75" height="28" class="metal"/><rect x="140" y="72" width="75" height="28" class="metal"/><path d="M118 70 Q130 56 142 70" fill="none" class="weld"/>',
  optional: '<polygon points="45,72 104,72 120,100 45,100" class="metal"/><polygon points="156,72 215,72 215,100 140,100" class="metal"/><path d="M105 70 Q130 46 155 70" fill="none" class="weld"/>',
  recommended: '<polygon points="45,62 96,62 122,105 45,105" class="metal"/><polygon points="164,62 215,62 215,105 138,105" class="metal"/><path d="M104 72 Q130 44 156 72" fill="none" class="weld"/><path d="M112 88 Q130 72 148 88" fill="none" class="weld"/>',
  multilayer: '<polygon points="45,55 92,55 122,110 45,110" class="metal"/><polygon points="168,55 215,55 215,110 138,110" class="metal"/><path d="M118 101 Q130 92 142 101" fill="none" class="weld"/><path d="M110 83 Q130 66 150 83" fill="none" class="weld"/><path d="M100 63 Q130 38 160 63" fill="none" class="weld"/>'
};

const JOINT_SVGS = {
  stumpf: '<rect x="42" y="76" width="84" height="18" class="metal"/><rect x="134" y="76" width="84" height="18" class="metal"/><path d="M126 76 L134 76 L139 94 L121 94 Z" class="weld-fill"/><line x1="72" y1="48" x2="188" y2="48" class="arrow"/>',
  kehl: '<rect x="56" y="84" width="150" height="18" class="metal"/><rect x="98" y="34" width="18" height="68" class="metal"/><path d="M116 84 L148 84 A32 32 0 0 0 116 52 Z" class="weld-fill"/><line x1="124" y1="58" x2="190" y2="58" class="arrow"/>',
  ueberlapp: '<rect x="54" y="80" width="140" height="18" class="metal"/><rect x="86" y="58" width="140" height="18" class="metal"/><line x1="98" y1="78" x2="152" y2="78" class="weld"/><circle cx="154" cy="78" r="4" class="arc"/><line x1="188" y1="32" x2="156" y2="74" class="torch"/><line x1="98" y1="42" x2="190" y2="42" class="arrow"/>'
};

const MATERIAL_SVGS = {
  blech: '<rect x="54" y="72" width="150" height="24" rx="2" class="metal"/><line x1="76" y1="62" x2="150" y2="62" class="weld"/><circle cx="152" cy="62" r="4" class="arc"/><line x1="190" y1="28" x2="154" y2="58" class="torch"/><line x1="76" y1="42" x2="190" y2="42" class="arrow"/>',
  vierkant: '<rect x="72" y="44" width="104" height="64" rx="4" fill="none" class="metal-line"/><line x1="88" y1="36" x2="134" y2="36" class="weld"/><circle cx="136" cy="36" r="4" class="arc"/><line x1="174" y1="16" x2="138" y2="32" class="torch"/><line x1="88" y1="20" x2="176" y2="20" class="arrow"/>',
  massiv: '<rect x="60" y="42" width="145" height="66" rx="5" class="metal"/><line x1="82" y1="32" x2="148" y2="32" class="weld"/><circle cx="150" cy="32" r="4" class="arc"/><line x1="188" y1="14" x2="152" y2="28" class="torch"/><line x1="82" y1="18" x2="190" y2="18" class="arrow"/>'
};

function svgBox(content) {
  return `<svg class="svgbox" viewBox="0 0 260 130" role="img" aria-hidden="true">${SVG_DEFS}${content}</svg>`;
}

function card(title, description, svg) {
  return `<div class="visual-card"><strong>${title}</strong><p class="small">${description}</p>${svg}</div>`;
}

function legend() {
  return '<p class="visual-legend small"><span class="legend-metal">Grau = Werkstück</span><span class="legend-weld">Blau = fertige Naht</span><span class="legend-torch">Gelb = Brenner</span><span class="legend-arc">Weiß = Lichtbogen</span><span class="legend-arrow">Grün = Schweißrichtung</span></p>';
}

export function renderOutputVisuals({ position, positionLabel, joint, jointLabel, shape, shapeLabel, fase }) {
  const target = document.getElementById('outputVisuals');
  if (!target) return;

  target.innerHTML = `
    <div class="visual-guideline">${legend()}</div>
    ${[
      card(positionLabel || 'Schweißposition', 'Naht läuft nur vom Pfeilstart bis zum Brenner.', svgBox(POSITION_SVGS[position] || POSITION_SVGS.pa)),
      card(jointLabel || 'Nahtart', 'Gewählte Nahtart mit korrekter Brennerposition.', svgBox(JOINT_SVGS[joint] || JOINT_SVGS.kehl)),
      card(shapeLabel || 'Materialform', 'Materialform aus der Rechnerauswahl.', svgBox(MATERIAL_SVGS[shape] || MATERIAL_SVGS.vierkant)),
      card('Nahtvorbereitung / Fase', fase.text, svgBox(FASE_SVGS[fase.visual] || FASE_SVGS.none))
    ].join('')}`;
}

export function renderLexiconVisuals() {
  const positionCards = [
    ['PA/PB – flach', 'Brenner bewegt sich in Pfeilrichtung. Die blaue Naht endet am Lichtbogen.', 'pa'],
    ['PC – horizontal', 'Waagrechte Naht an senkrechter Fläche. Schmelzbad klein halten.', 'pc'],
    ['PF – steigend', 'Von unten nach oben: sicherer Einbrand in Zwangslage.', 'pf'],
    ['PG – fallend', 'Von oben nach unten: eher für dünnes Material und schnelle Führung.', 'pg'],
    ['PD/PE – über Kopf', 'Schwierige Lage: geringe Wärmeeinbringung und kleines Bad.', 'pe']
  ].map(([title, description, key]) => card(title, description, svgBox(POSITION_SVGS[key]))).join('');

  const jointCards = [
    ['Stumpfnaht', 'Zwei Bauteilkanten werden in einer Ebene verbunden.', 'stumpf'],
    ['Kehlnaht / T-Stoß', 'Die Naht liegt im Winkel zwischen zwei Bauteilen.', 'kehl'],
    ['Überlappnaht', 'Ein Bauteil liegt über dem anderen; Naht an der Überlappkante.', 'ueberlapp']
  ].map(([title, description, key]) => card(title, description, svgBox(JOINT_SVGS[key]))).join('');

  const materialCards = [
    ['Blech', 'Flaches Material mit hoher Wärmeempfindlichkeit bei geringer Stärke.', 'blech'],
    ['Vierkantrohr / Profil', 'Hohlprofil; Kanten und Wandstärke besonders beachten.', 'vierkant'],
    ['Massivmaterial', 'Höhere Wärmekapazität; Einbrand und Vorwärmung prüfen.', 'massiv']
  ].map(([title, description, key]) => card(title, description, svgBox(MATERIAL_SVGS[key]))).join('');

  const faseCards = [
    ['Keine Fase', 'Bis ca. 3 mm meist ohne Fase. Kanten sauber anlegen und Wärmeeintrag kontrollieren.', 'none'],
    ['Leichte V-Fase optional', 'Bei ca. 4–5 mm kann eine leichte Fase helfen, wenn mehr Einbrand benötigt wird.', 'optional'],
    ['V-Fase empfohlen', 'Ab ca. 6–9 mm wird Nahtvorbereitung deutlich wichtiger, besonders bei Stumpfnähten.', 'recommended'],
    ['Mehrlagig', 'Ab ca. 10 mm sind Fase und mehrere Lagen in der Praxis häufig erforderlich.', 'multilayer']
  ].map(([title, description, key]) => card(title, description, svgBox(FASE_SVGS[key]))).join('');

  return `
    <section class="lexicon-visual-block">
      <h3>Darstellungslegende</h3>
      ${legend()}
      <p class="small">Fachregel: Die blaue Naht zeigt nur den bereits geschweißten Bereich vom Pfeilstart bis zum Brenner. Hinter dem Brenner wird keine Naht dargestellt.</p>
    </section>
    <section class="lexicon-visual-block">
      <h3>Schweißpositionen als Skizze</h3>
      <div class="visual-grid lexicon-grid">${positionCards}</div>
    </section>
    <section class="lexicon-visual-block">
      <h3>Nahtarten</h3>
      <div class="visual-grid lexicon-grid">${jointCards}</div>
    </section>
    <section class="lexicon-visual-block">
      <h3>Materialformen</h3>
      <div class="visual-grid lexicon-grid">${materialCards}</div>
    </section>
    <section class="lexicon-visual-block">
      <h3>Fase, Spalt und Mehrlagen</h3>
      <p class="small">Die Skizzen zeigen die grundsätzliche Nahtvorbereitung. Herstellerdaten, WPS und Bauteilanforderungen haben Vorrang.</p>
      <div class="visual-grid lexicon-grid">${faseCards}</div>
      <div class="table-wrap">
        <table>
          <tr><th>Materialstärke</th><th>Praxis-Hinweis</th></tr>
          <tr><td>bis ca. 3 mm</td><td>Fase meist nicht nötig.</td></tr>
          <tr><td>4–5 mm</td><td>Fase optional, abhängig von Nahtart und Einbrandbedarf.</td></tr>
          <tr><td>6–9 mm</td><td>Fase prüfen; Mehrlagen können sinnvoll werden.</td></tr>
          <tr><td>ab ca. 10 mm</td><td>Fase und Mehrlagen praktisch Standard.</td></tr>
        </table>
      </div>
    </section>
  `;
}
