const round = (value, digits = 0) => Number(value).toFixed(digits);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function findFeedback(corrections, sliderValue) {
  const item = corrections.feedback.find(entry => sliderValue >= entry.min && sliderValue <= entry.max) || corrections.feedback[2];
  // Jeder Slider-Schritt verändert die Energie.
  // Negativ = Naht liegt auf => mehr Energie; positiv = Durchbrand => weniger Energie.
  return { ...item, trim: -Number(sliderValue) * 2 };
}

export function calculateWelding(input, data, feedbackTrim = 0) {
  const process = byId(data.processes, input.process);
  const material = byId(data.materials, input.material);
  const joint = byId(data.joints, input.joint);
  const position = byId(data.positions, input.position);
  const shape = byId(data.shapes, input.shape);
  const thickness = clamp(Number(input.thickness || 0), 0.4, 30);
  const manualTrim = Number(input.trim || 0);
  const totalTrimFactor = 1 + ((manualTrim + feedbackTrim) / 100);
  const factor = material.factor * joint.factor * position.factor * shape.factor * totalTrimFactor;

  const amps = clamp(thickness * process.baseAmpPerMm * factor, 25, 360);
  const volt = process.type === 'wire' ? clamp(process.baseVolt + thickness * process.voltPerMm + ((amps - 120) / 100), 14, 32) : null;
  const wire = Number(input.wire || 0.9);
  const wfs = process.type === 'wire' ? clamp((amps / 42) * process.feedFactor * (0.9 / wire), 1.8, 15) : null;

  const fase = thickness < 4
    ? { visual: 'none', level: 'info', text: 'Keine Fase nötig, Kanten sauber vorbereiten.' }
    : thickness < 6
      ? { visual: 'optional', level: 'warn', text: 'Leichte Fase prüfen; besonders bei Stumpfnähten.' }
      : thickness < 8
        ? { visual: 'recommended', level: 'warn', text: 'Fase empfohlen; sauberen Wurzelbereich sicherstellen.' }
        : { visual: 'multilayer', level: 'danger', text: 'Fase und mehrlagiges Arbeiten einplanen.' };

  const heroMain = process.type === 'wire' ? `${round(amps)} A · ${round(volt, 1)} V` : `${round(amps)} A`;
  const heroSub = process.type === 'wire' ? `${round(wfs, 1)} m/min Drahtvorschub` : process.type === 'tig' ? 'Zusatzwerkstoff von Hand' : 'Elektrode passend zum Material wählen';

  return {
    amps,
    volt,
    wfs,
    polarity: process.polarity,
    gas: process.gas,
    heroMain,
    heroSub,
    practice: process.type === 'cut' ? 'Schnittprobe machen, Luftdruck und Schnittgeschwindigkeit prüfen.' : thickness <= 2 ? 'Kurze Heftpunkte, Wärmeeintrag niedrig halten.' : thickness >= 8 ? 'Mehrlagig arbeiten und Zwischenlagen reinigen.' : 'Probenaht setzen und Laufgeräusch prüfen.',
    fase,
    positionId: position.id,
    positionLabel: position.label,
    why: `Berechnet aus Verfahren, Materialstärke, Material-, Naht-, Positions- und Formfaktor. Aktive Gesamtkorrektur: ${round(manualTrim + feedbackTrim)} %.`
  };
}
