const SVG_DEFS = '';

const POSITION_SVGS = {
  pa: '<rect x="35" y="78" width="190" height="18" class="metal"/><line x1="62" y1="68" x2="148" y2="68" class="weld"/><circle cx="150" cy="68" r="4" class="arc"/><line x1="182" y1="26" x2="152" y2="64" class="torch"/><line x1="62" y1="39" x2="182" y2="39" class="arrow"/><path d="M182 39 L174 34 L174 44 Z" class="arrow-head"/>',
  pc: '<rect x="126" y="20" width="20" height="95" class="metal"/><line x1="116" y1="34" x2="116" y2="64" class="weld"/><circle cx="116" cy="66" r="4" class="arc"/><line x1="58" y1="66" x2="112" y2="66" class="torch"/><line x1="91" y1="34" x2="91" y2="100" class="arrow"/><path d="M91 100 L86 92 L96 92 Z" class="arrow-head"/>',
  pf: '<rect x="126" y="20" width="20" height="95" class="metal"/><line x1="116" y1="100" x2="116" y2="68" class="weld"/><circle cx="116" cy="66" r="4" class="arc"/><line x1="60" y1="92" x2="112" y2="68" class="torch"/><line x1="86" y1="100" x2="86" y2="34" class="arrow"/><path d="M86 34 L81 42 L91 42 Z" class="arrow-head"/>',
  pg: '<rect x="126" y="20" width="20" height="95" class="metal"/><line x1="116" y1="34" x2="116" y2="64" class="weld"/><circle cx="116" cy="66" r="4" class="arc"/><line x1="60" y1="42" x2="112" y2="64" class="torch"/><line x1="86" y1="34" x2="86" y2="100" class="arrow"/><path d="M86 100 L81 92 L91 92 Z" class="arrow-head"/>',
  pe: '<rect x="35" y="28" width="190" height="18" class="metal"/><line x1="62" y1="56" x2="148" y2="56" class="weld"/><circle cx="150" cy="56" r="4" class="arc"/><line x1="182" y1="106" x2="152" y2="60" class="torch"/><line x1="62" y1="88" x2="182" y2="88" class="arrow"/><path d="M182 88 L174 83 L174 93 Z" class="arrow-head"/>'
};

const FASE_SVGS = {
  none: '<rect x="45" y="72" width="75" height="28" class="metal"/><rect x="140" y="72" width="75" height="28" class="metal"/><path d="M120 72 L140 72 L140 100 L120 100 Z" class="weld-fill"/>',
  optional: '<polygon points="45,72 104,72 120,100 45,100" class="metal"/><polygon points="156,72 215,72 215,100 140,100" class="metal"/><path d="M104 72 L156 72 L140 100 L120 100 Z" class="weld-fill"/>',
  recommended: '<polygon points="45,62 96,62 122,105 45,105" class="metal"/><polygon points="164,62 215,62 215,105 138,105" class="metal"/><path d="M96 62 L164 62 L138 105 L122 105 Z" class="weld-fill"/><path d="M108 79 Q130 66 152 79" class="layer-line"/>',
  multilayer: '<polygon points="45,55 92,55 122,110 45,110" class="metal"/><polygon points="168,55 215,55 215,110 138,110" class="metal"/><path d="M92 55 L168 55 L138 110 L122 110 Z" class="weld-fill"/><path d="M106 82 Q130 68 154 82" class="layer-line"/><path d="M114 98 Q130 89 146 98" class="layer-line"/>'
};

const JOINT_SVGS = {
  stumpf: '<rect x="42" y="76" width="84" height="18" class="metal"/><rect x="134" y="76" width="84" height="18" class="metal"/><path d="M126 76 L134 76 L139 94 L121 94 Z" class="weld-fill"/><circle cx="130" cy="73" r="4" class="arc"/><line x1="174" y1="30" x2="134" y2="69" class="torch"/><line x1="76" y1="30" x2="166" y2="30" class="arrow"/><path d="M166 30 L158 25 L158 35 Z" class="arrow-head"/>',
  kehl: '<rect x="56" y="84" width="150" height="18" class="metal"/><rect x="98" y="34" width="18" height="68" class="metal"/><path d="M116 84 L148 84 A32 32 0 0 0 116 52 Z" class="weld-fill"/><circle cx="143" cy="76" r="4" class="arc"/><line x1="184" y1="34" x2="147" y2="72" class="torch"/><line x1="124" y1="28" x2="184" y2="28" class="arrow"/><path d="M184 28 L176 23 L176 33 Z" class="arrow-head"/>',
  ueberlapp: '<rect x="54" y="80" width="140" height="18" class="metal"/><rect x="86" y="58" width="140" height="18" class="metal"/><path d="M98 80 L154 80 A10 10 0 0 0 144 70 L98 70 Z" class="weld-fill"/><circle cx="154" cy="78" r="4" class="arc"/><line x1="188" y1="32" x2="158" y2="73" class="torch"/><line x1="98" y1="28" x2="184" y2="28" class="arrow"/><path d="M184 28 L176 23 L176 33 Z" class="arrow-head"/>'
};

const MATERIAL_SVGS = {
  blech: '<rect x="54" y="72" width="150" height="24" rx="2" class="metal"/><line x1="76" y1="62" x2="150" y2="62" class="weld"/><circle cx="152" cy="62" r="4" class="arc"/><line x1="190" y1="28" x2="154" y2="58" class="torch"/><line x1="76" y1="24" x2="184" y2="24" class="arrow"/><path d="M184 24 L176 19 L176 29 Z" class="arrow-head"/>',
  vierkant: '<rect x="72" y="44" width="104" height="64" rx="4" fill="none" class="metal-line"/><line x1="88" y1="36" x2="134" y2="36" class="weld"/><circle cx="136" cy="36" r="4" class="arc"/><line x1="174" y1="16" x2="138" y2="32" class="torch"/><line x1="88" y1="10" x2="168" y2="10" class="arrow"/><path d="M168 10 L160 5 L160 15 Z" class="arrow-head"/>',
  massiv: '<rect x="60" y="42" width="145" height="66" rx="5" class="metal"/><line x1="82" y1="32" x2="148" y2="32" class="weld"/><circle cx="150" cy="32" r="4" class="arc"/><line x1="188" y1="14" x2="152" y2="28" class="torch"/><line x1="82" y1="8" x2="180" y2="8" class="arrow"/><path d="M180 8 L172 3 L172 13 Z" class="arrow-head"/>'
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
      card(jointLabel || 'Nahtart', 'Querschnitt mit korrekter Nahtform, Brennerposition und Schweißrichtung.', svgBox(JOINT_SVGS[joint] || JOINT_SVGS.kehl)),
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
    ['Stumpfnaht', 'Der blaue Querschnitt füllt den Spalt zwischen den Bauteilkanten.', 'stumpf'],
    ['Kehlnaht / T-Stoß', 'Die blaue Naht wird als Viertelkreis in der Kehle dargestellt.', 'kehl'],
    ['Überlappnaht', 'Naht an der Überlappkante mit Brenner und Schweißrichtung.', 'ueberlapp']
  ].map(([title, description, key]) => card(title, description, svgBox(JOINT_SVGS[key]))).join('');

  const materialCards = [
    ['Blech', 'Flaches Material mit hoher Wärmeempfindlichkeit bei geringer Stärke.', 'blech'],
    ['Vierkantrohr / Profil', 'Hohlprofil; Kanten und Wandstärke besonders beachten.', 'vierkant'],
    ['Massivmaterial', 'Höhere Wärmekapazität; Einbrand und Vorwärmung prüfen.', 'massiv']
  ].map(([title, description, key]) => card(title, description, svgBox(MATERIAL_SVGS[key]))).join('');

  const faseCards = [
    ['Keine Fase', 'Bis ca. 3 mm meist ohne Fase. Der Spalt wird vollständig gefüllt.', 'none'],
    ['Leichte V-Fase optional', 'Bei ca. 4–5 mm kann eine leichte Fase den Einbrand unterstützen.', 'optional'],
    ['V-Fase empfohlen', 'Ab ca. 6–9 mm wird Nahtvorbereitung deutlich wichtiger.', 'recommended'],
    ['Mehrlagig', 'Ab ca. 10 mm sind Fase und mehrere Lagen häufig erforderlich.', 'multilayer']
  ].map(([title, description, key]) => card(title, description, svgBox(FASE_SVGS[key]))).join('');

  return `
    <section class="lexicon-visual-block">
      <h3>Darstellungslegende</h3>
      ${legend()}
      <p class="small">Fachregel: Die blaue Naht zeigt nur den bereits geschweißten Bereich bis zum Brenner. Der grüne Pfeil liegt oberhalb des Brenners und besitzt eine dezente, zuverlässig sichtbare Pfeilspitze.</p>
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
