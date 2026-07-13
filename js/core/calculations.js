import { buildManufacturerComparison, findManufacturerReferences, getDeviceCurrentLimits, getManufacturerName, selectPrimaryReference } from './manufacturers.js';

const round = (value, digits = 0) => Number(value).toFixed(digits);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function makeRangeLabel(min, max) {
  if (min === null || max === null || min === undefined || max === undefined) return null;
  return `${round(min)}–${round(max)} A`;
}

function byId(list, id) {
  return list.find(item => item.id === id);
}

function getElectrodeData(data, diameter) {
  return data?.electrodes?.find(item => Math.abs(Number(item.diameterMm) - Number(diameter)) < 0.05) || null;
}

function getFormulaCurrent(process, material, thickness, electrodeData = null) {
  const materialId = material?.id;
  switch (process.id) {
    case 'mag':
      return thickness * 40;
    case 'mig':
      return thickness * 40 * (materialId === 'alu' ? 1.30 : 1);
    case 'fcaw_s':
      return thickness * 38;
    case 'wig_dc':
      return thickness * 30;
    case 'wig_ac':
      return thickness * 30 * (materialId === 'alu' ? 1.30 : 1);
    case 'mma':
      if (electrodeData) return (Number(electrodeData.currentMinA) + Number(electrodeData.currentMaxA)) / 2;
      return thickness * 35;
    case 'plasma':
      return thickness * 7;
    default:
      return thickness * Number(process.baseAmpPerMm || 35);
  }
}


function getCurrentFormulaText(process, material, thickness, electrodeData = null) {
  const value = round(thickness, 2);
  switch (process.id) {
    case 'mag':
      return `${value} mm × 40 A/mm`;
    case 'mig':
      return material?.id === 'alu'
        ? `${value} mm × 40 A/mm × 1,30 Aluminiumfaktor`
        : `${value} mm × 40 A/mm`;
    case 'fcaw_s':
      return `${value} mm × 38 A/mm`;
    case 'wig_dc':
      return `${value} mm × 30 A/mm`;
    case 'wig_ac':
      return material?.id === 'alu'
        ? `${value} mm × 30 A/mm × 1,30 Aluminiumfaktor`
        : `${value} mm × 30 A/mm`;
    case 'mma':
      return electrodeData
        ? `Mittelwert des Elektrodenbereichs ${round(electrodeData.currentMinA)}–${round(electrodeData.currentMaxA)} A`
        : `${value} mm × 35 A/mm`;
    case 'plasma':
      return `${value} mm × 7 A/mm`;
    default:
      return `${value} mm × ${round(process.baseAmpPerMm || 35, 2)} A/mm`;
  }
}

function buildCalculationTrace({
  process, material, joint, position, shape, thickness, electrodeData, formulaCurrent,
  geometryFactor, uncalibratedCurrent, currentRange, calibratedBaseCurrent, manualTrim,
  feedbackTrim, adjustment, requestedAmps, deviceLimit, amps, volt, wire, wfs,
  travelSpeed, heatInput, primaryManufacturerReference
}) {
  const steps = [];
  const add = (id, label, value, detail, state = 'info') => steps.push({ id, label, value, detail, state });

  add(
    'basis',
    'Eingabegrundlage',
    `${process.label} · ${material.label} · ${round(thickness, 2)} mm`,
    process.id === 'mma' && electrodeData
      ? `Die Materialreferenz wird aus der gewählten Elektrode ${round(electrodeData.diameterMm, 1)} mm abgeleitet.`
      : 'Die eingegebene Materialstärke bildet die Ausgangsbasis.'
  );
  add(
    'formula',
    'Verfahrens-Grundstrom',
    `${round(formulaCurrent)} A`,
    getCurrentFormulaText(process, material, thickness, electrodeData)
  );
  add(
    'geometry',
    'Geometrie und Position',
    `${round(uncalibratedCurrent)} A`,
    `${round(formulaCurrent)} A × Nahtfaktor ${round(joint.factor, 2)} × Positionsfaktor ${round(position.factor, 2)} × Formfaktor ${round(shape.factor, 2)} = Faktor ${round(geometryFactor, 3)}.`
  );
  add(
    'calibration',
    'Kalibrierung',
    `${round(calibratedBaseCurrent)} A`,
    `${primaryManufacturerReference ? 'Herstellerbereich' : 'Generischer Rechenbereich'} ${makeRangeLabel(currentRange.min, currentRange.max)}; der unkalibrierte Wert wird auf diesen Korridor begrenzt.`,
    primaryManufacturerReference ? 'pass' : 'info'
  );
  add(
    'trim',
    'Feinkorrektur',
    `${round(requestedAmps)} A`,
    `${round(calibratedBaseCurrent)} A × ${round(adjustment, 3)} bei manueller Korrektur ${round(manualTrim)} % und Nahtfeedback ${round(feedbackTrim)} %.`
  );
  add(
    'device',
    'Gerätebegrenzung',
    `${round(amps)} A`,
    deviceLimit
      ? `${deviceLimit.deviceName}: ${round(deviceLimit.minA)}–${round(deviceLimit.maxA)} A. ${deviceLimit.limited ? deviceLimit.action : 'Keine Begrenzung erforderlich.'}`
      : 'Für dieses Verfahren ist kein aktives Geräteprofil hinterlegt.',
    deviceLimit?.limited ? 'warn' : 'pass'
  );

  if (volt !== null) {
    add('voltage', 'Lichtbogenspannung', `${round(volt, 1)} V`, 'Verfahrensabhängige Spannungskennlinie auf Basis des begrenzten Ausgangsstroms.');
  }
  if (wfs !== null) {
    add('wireFeed', 'Drahtvorschub', `${round(wfs, 1)} m/min`, `Berechnet aus ${round(amps)} A, Drahtdurchmesser ${round(wire, 1)} mm und dem verfahrensabhängigen Vorschubfaktor.`);
  }
  if (travelSpeed !== null) {
    add('travel', 'Schweißgeschwindigkeit', `${round(travelSpeed)} mm/min`, `Verfahrensabhängige Geschwindigkeitskennlinie für ${round(thickness, 2)} mm Materialstärke.`);
  }
  if (heatInput !== null) {
    add('heat', 'Wärmeeintrag', `${round(heatInput, 2)} kJ/mm`, `(${round(volt, 1)} V × ${round(amps)} A × 60) ÷ (1000 × ${round(travelSpeed)} mm/min).`);
  }

  return { steps };
}

function getGenericRange(process, theoreticalCurrent, isCut) {
  const spread = process.type === 'wire' ? 0.18 : process.type === 'tig' ? 0.16 : 0.20;
  const minLimit = isCut ? 15 : 20;
  const maxLimit = isCut ? 120 : 360;
  return {
    min: clamp(theoreticalCurrent * (1 - spread), minLimit, maxLimit),
    max: clamp(theoreticalCurrent * (1 + spread), minLimit, maxLimit)
  };
}

function getManufacturerRange(primary, fallbackRange) {
  if (!primary || primary.currentMinA === null || primary.currentMinA === undefined ||
      primary.currentMaxA === null || primary.currentMaxA === undefined) {
    return fallbackRange;
  }
  return {
    min: Number(primary.currentMinA),
    max: Number(primary.currentMaxA)
  };
}

function calculateArcVoltage(process, amps) {
  switch (process.id) {
    case 'mag':
    case 'mig':
      return clamp(14 + (amps / 25), 14, 32);
    case 'fcaw_s':
      return clamp(22 + (amps / 30), 16, 34);
    case 'wig_dc':
    case 'wig_ac':
      return clamp(10 + (amps / 40), 10, 18);
    case 'mma':
      return clamp(20 + (amps / 50), 20, 30);
    default:
      return null;
  }
}

function calculateWireFeed(process, amps, wire) {
  if (process.type !== 'wire') return null;
  const diameter = Number(wire || 0.9);
  const ampDivisor = diameter <= 0.6 ? 31
    : diameter <= 0.8 ? 37
      : diameter <= 0.9 ? 42
        : diameter <= 1.0 ? 48
          : 60;
  const processFactor = process.id === 'mig' ? 1.15 : process.id === 'fcaw_s' ? 0.95 : 1;
  return clamp((amps / ampDivisor) * processFactor, 1.5, 18);
}

function calculateTravelSpeed(process, thickness) {
  switch (process.id) {
    case 'mag':
    case 'mig':
      return clamp(300 - (thickness * 20), 80, 300);
    case 'wig_dc':
    case 'wig_ac':
      return clamp(150 - (thickness * 10), 45, 150);
    case 'mma':
      return clamp(200 - (thickness * 15), 55, 200);
    case 'fcaw_s':
      return clamp(250 - (thickness * 18), 70, 250);
    default:
      return null;
  }
}


function buildPlausibilityChecks({ process, amps, requestedAmps, volt, wfs, travelSpeed, heatInput, currentRange, deviceLimit, primaryManufacturerReference }) {
  const checks = [];
  const add = (id, label, state, text) => checks.push({ id, label, state, text });
  const finitePositive = value => Number.isFinite(Number(value)) && Number(value) > 0;

  add(
    'current',
    'Stromwert',
    finitePositive(amps) ? 'pass' : 'fail',
    finitePositive(amps)
      ? `${round(amps)} A wurden als endlicher positiver Wert berechnet.`
      : 'Der Stromwert konnte nicht plausibel berechnet werden.'
  );

  const insideCalibration = finitePositive(amps) && currentRange
    ? Number(amps) >= Number(currentRange.min) && Number(amps) <= Number(currentRange.max)
    : false;
  add(
    'calibration',
    'Kalibrierkorridor',
    insideCalibration ? 'pass' : deviceLimit?.limited ? 'warn' : 'fail',
    insideCalibration
      ? `Ausgabe liegt im verwendeten Korridor ${makeRangeLabel(currentRange.min, currentRange.max)}.`
      : deviceLimit?.limited
        ? 'Die Ausgabe wurde durch das aktive Gerätelimit begrenzt.'
        : 'Die Ausgabe liegt außerhalb des verwendeten Kalibrierkorridors.'
  );

  if (deviceLimit) {
    add(
      'device',
      'Gerätebereich',
      deviceLimit.limited ? 'warn' : 'pass',
      deviceLimit.limited
        ? deviceLimit.action
        : `Der angeforderte Wert ${round(requestedAmps)} A liegt im Gerätebereich ${round(deviceLimit.minA)}–${round(deviceLimit.maxA)} A.`
    );
  }

  if (process.type !== 'cut') {
    add(
      'voltage',
      'Spannung',
      finitePositive(volt) ? 'pass' : 'fail',
      finitePositive(volt)
        ? `${round(volt, 1)} V wurden verfahrensabhängig berechnet.`
        : 'Für dieses Verfahren fehlt ein verwertbarer Spannungswert.'
    );
    add(
      'travel',
      'Schweißgeschwindigkeit',
      finitePositive(travelSpeed) ? 'pass' : 'fail',
      finitePositive(travelSpeed)
        ? `${round(travelSpeed)} mm/min bilden die Berechnungsbasis des Wärmeeintrags.`
        : 'Die Schweißgeschwindigkeit ist nicht verwertbar.'
    );
    add(
      'heat',
      'Wärmeeintrag',
      finitePositive(heatInput) ? 'pass' : 'fail',
      finitePositive(heatInput)
        ? `${round(heatInput, 2)} kJ/mm wurden aus Strom, Spannung und Schweißgeschwindigkeit berechnet.`
        : 'Der Wärmeeintrag konnte nicht vollständig berechnet werden.'
    );
  }

  if (process.type === 'wire') {
    add(
      'wireFeed',
      'Drahtvorschub',
      finitePositive(wfs) ? 'pass' : 'fail',
      finitePositive(wfs)
        ? `${round(wfs, 1)} m/min wurden für den gewählten Drahtdurchmesser berechnet.`
        : 'Der Drahtvorschub konnte nicht verwertbar berechnet werden.'
    );
  }

  add(
    'source',
    'Datenbasis',
    primaryManufacturerReference ? 'pass' : 'info',
    primaryManufacturerReference
      ? 'Ein passender Herstellerbereich wurde zur Kalibrierung verwendet.'
      : 'Kein passender Herstellerbereich vorhanden; die eigene Berechnungsengine bleibt maßgeblich.'
  );

  const failed = checks.filter(item => item.state === 'fail').length;
  const warnings = checks.filter(item => item.state === 'warn').length;
  return {
    state: failed ? 'fail' : warnings ? 'warn' : 'pass',
    failed,
    warnings,
    checks
  };
}

function calculateHeatInput(volt, amps, travelSpeed) {
  if (volt === null || travelSpeed === null || travelSpeed <= 0) return null;
  return (volt * amps * 60) / (1000 * travelSpeed);
}

export function findFeedback(corrections, sliderValue) {
  const item = corrections.feedback.find(entry => sliderValue >= entry.min && sliderValue <= entry.max) || corrections.feedback[2];
  return { ...item, trim: -Number(sliderValue) * 2 };
}

export function calculateWelding(input, data, feedbackTrim = 0) {
  const process = byId(data.processes, input.process);
  const material = byId(data.materials, input.material);
  const joint = byId(data.joints, input.joint);
  const position = byId(data.positions, input.position);
  const shape = byId(data.shapes, input.shape);
  const selectedThickness = clamp(Number(input.thickness || 0), 0.4, 30);
  const electrodeData = process.id === 'mma' ? getElectrodeData(data, input.electrode) : null;
  const thickness = process.id === 'mma' && electrodeData
    ? (Number(electrodeData.materialMinMm) + Number(electrodeData.materialMaxMm)) / 2
    : selectedThickness;
  const manualTrim = Number(input.trim || 0);
  const adjustment = 1 + ((manualTrim + feedbackTrim) / 100);

  const isCut = process.type === 'cut';
  const formulaCurrent = getFormulaCurrent(process, material, thickness, electrodeData);
  const manufacturerInput = process.id === 'mma' ? { ...input, thickness } : input;
  const allManufacturerReferences = findManufacturerReferences(manufacturerInput, data);
  const manufacturerComparisonEnabled = input.manufacturerComparison !== false;
  const selectedManufacturerId = input.manufacturerId || 'all';
  const manufacturerReferences = manufacturerComparisonEnabled
    ? findManufacturerReferences(manufacturerInput, data, selectedManufacturerId)
    : [];
  const primaryManufacturerReference = selectPrimaryReference(allManufacturerReferences, { amps: formulaCurrent });

  const manufacturerSummary = !manufacturerComparisonEnabled
    ? 'Herstellervergleich ist ausgeblendet.'
    : manufacturerReferences.length
      ? `${manufacturerReferences.length} Vergleichsdatensatz gefunden: ${[...new Set(manufacturerReferences.map(entry => getManufacturerName(data, entry.manufacturerId)))].join(', ')}`
      : selectedManufacturerId === 'all'
        ? 'Kein passender Herstellerdatensatz im aktuellen Datenstand.'
        : `Für den gewählten Hersteller liegt für diese Kombination kein passender Datensatz vor.`;

  const theoreticalCurrent = formulaCurrent;
  const geometryFactor = joint.factor * position.factor * shape.factor;
  const uncalibratedCurrent = theoreticalCurrent * geometryFactor;
  const genericRange = getGenericRange(process, uncalibratedCurrent, isCut);
  const electrodeRange = electrodeData ? { min: Number(electrodeData.currentMinA), max: Number(electrodeData.currentMaxA) } : null;
  const currentRange = process.id === 'mma' && electrodeRange
    ? getManufacturerRange(primaryManufacturerReference, electrodeRange)
    : getManufacturerRange(primaryManufacturerReference, genericRange);

  // Hersteller-Handbuchbereiche bilden bei passendem Datensatz den Kalibrierkorridor.
  const calibratedBaseCurrent = clamp(uncalibratedCurrent, currentRange.min, currentRange.max);
  const requestedAmps = clamp(calibratedBaseCurrent * adjustment, currentRange.min * 0.85, currentRange.max * 1.15);
  const deviceCurrentLimits = getDeviceCurrentLimits(process.id, data);
  const amps = deviceCurrentLimits
    ? clamp(requestedAmps, deviceCurrentLimits.minA, deviceCurrentLimits.maxA)
    : requestedAmps;

  let deviceLimit = null;
  if (deviceCurrentLimits) {
    const state = requestedAmps > deviceCurrentLimits.maxA
      ? 'above'
      : requestedAmps < deviceCurrentLimits.minA
        ? 'below'
        : 'within';
    const action = state === 'above'
      ? `Der berechnete Bedarf von ${round(requestedAmps)} A überschreitet die maximale Ausgangsleistung. Die Ausgabe wurde auf ${round(deviceCurrentLimits.maxA)} A begrenzt.`
      : state === 'below'
        ? `Der berechnete Bedarf von ${round(requestedAmps)} A liegt unter dem einstellbaren Mindeststrom. Die Ausgabe wurde auf ${round(deviceCurrentLimits.minA)} A angehoben.`
        : `Der berechnete Strom liegt innerhalb des Gerätebereichs.`;
    deviceLimit = {
      ...deviceCurrentLimits,
      state,
      requestedA: requestedAmps,
      outputA: amps,
      limited: state !== 'within',
      action
    };
  }

  const volt = calculateArcVoltage(process, amps);
  const wire = Number(input.wire || 0.9);
  const wfs = calculateWireFeed(process, amps, wire);
  const travelSpeed = calculateTravelSpeed(process, thickness);
  const heatInput = calculateHeatInput(volt, amps, travelSpeed);
  const manufacturerComparison = manufacturerComparisonEnabled
    ? buildManufacturerComparison({ amps, volt, wfs, processType: process.type }, manufacturerReferences, data)
    : { available: false, disabled: true, note: 'Herstellervergleich ist deaktiviert.' };
  const plausibility = buildPlausibilityChecks({
    process,
    amps,
    requestedAmps,
    volt,
    wfs,
    travelSpeed,
    heatInput,
    currentRange,
    deviceLimit,
    primaryManufacturerReference
  });
  const calculationTrace = buildCalculationTrace({
    process,
    material,
    joint,
    position,
    shape,
    thickness,
    electrodeData,
    formulaCurrent,
    geometryFactor,
    uncalibratedCurrent,
    currentRange,
    calibratedBaseCurrent,
    manualTrim,
    feedbackTrim,
    adjustment,
    requestedAmps,
    deviceLimit,
    amps,
    volt,
    wire,
    wfs,
    travelSpeed,
    heatInput,
    primaryManufacturerReference
  });

  let fase = thickness < 4
    ? { visual: 'none', level: 'info', text: 'Keine Fase nötig, Kanten sauber vorbereiten.' }
    : thickness < 6
      ? { visual: 'optional', level: 'warn', text: 'Leichte Fase prüfen; besonders bei Stumpfnähten.' }
      : thickness < 8
        ? { visual: 'recommended', level: 'warn', text: 'Fase empfohlen; sauberen Wurzelbereich sicherstellen.' }
        : { visual: 'multilayer', level: 'danger', text: 'Fase und mehrlagiges Arbeiten einplanen.' };

  const recommendedMaterialThickness = process.id === 'mma' && electrodeData
    ? `${Number(electrodeData.materialMinMm).toFixed(1).replace('.', ',')}–${Number(electrodeData.materialMaxMm).toFixed(1).replace('.', ',')} mm`
    : null;

  if (process.id === 'mma' && electrodeData) {
    fase = { visual: 'electrode-reference', level: 'info', text: `MMA-Referenz: ${recommendedMaterialThickness} Materialstärke für die gewählte Elektrode. Bauteilvorbereitung und Lagenaufbau separat beurteilen.` };
  }
  const electrodeCompatibilityText = process.id === 'mma' && electrodeData
    ? `Für die gewählte ${Number(electrodeData.diameterMm).toFixed(1).replace('.', ',')} mm Elektrode wird eine Materialstärke von ${recommendedMaterialThickness} empfohlen.`
    : '';

  const calibrationText = primaryManufacturerReference
    ? `Passender Herstellerbereich ${makeRangeLabel(currentRange.min, currentRange.max)} wurde als Kalibrierkorridor verwendet.`
    : `Generischer Rechenbereich ${makeRangeLabel(currentRange.min, currentRange.max)} wurde verwendet.`;

  return {
    processType: process.type,
    processId: process.id,
    electrodeDiameter: process.id === 'mma' ? Number(input.electrode || 0) : null,
    electrodeRange: process.id === 'mma' && electrodeData ? `${electrodeData.currentMinA}–${electrodeData.currentMaxA} A` : null,
    recommendedMaterialThickness,
    amps,
    requestedAmps,
    deviceLimit,
    volt,
    wfs,
    travelSpeed,
    heatInput,
    currentRange,
    currentRangeLabel: makeRangeLabel(currentRange.min, currentRange.max),
    formulaReference: process.reference || null,
    manufacturerReferences,
    allManufacturerReferences,
    selectedManufacturerId,
    manufacturerComparisonEnabled,
    primaryManufacturerReference,
    manufacturerSummary,
    manufacturerComparison,
    plausibility,
    calculationTrace,
    polarity: process.polarity,
    gas: process.gas,
    practice: deviceLimit?.limited
      ? `${deviceLimit.action} ${process.type === 'cut' ? 'Schnittprobe machen, Luftdruck und Schnittgeschwindigkeit prüfen.' : 'Probenaht durchführen und gegebenenfalls ein leistungsgeeigneteres Gerät verwenden.'}`
      : process.type === 'cut'
      ? 'Schnittprobe machen, Luftdruck und Schnittgeschwindigkeit prüfen.'
      : process.id === 'mma'
        ? `${electrodeCompatibilityText} Elektrodenverpackung und Polarität beachten.`
        : thickness <= 2
        ? 'Kurze Heftpunkte, Wärmeeintrag niedrig halten.'
        : thickness >= 8
          ? 'Mehrlagig arbeiten und Zwischenlagen reinigen.'
          : 'Probenaht setzen und Laufgeräusch prüfen.',
    fase,
    positionId: position.id,
    positionLabel: position.label,
    jointId: joint.id,
    jointLabel: joint.label,
    shapeId: shape.id,
    shapeLabel: shape.label,
    why: isCut
      ? `Schneidstrom aus Materialstärke und Verfahrenskennlinie. ${deviceLimit?.limited ? deviceLimit.action + ' ' : ''}${calibrationText} Gerätehandbuch, Probeschnitt und Arbeitsschutz haben Vorrang. ${manufacturerSummary}`
      : `Eigene Berechnungsengine: ${process.id === 'mma' ? 'Elektrodendurchmesser als primäre Strombasis' : 'verfahrensabhängiger Grundstrom'}, Geometrie- und Positionskorrektur, anschließend Herstellerkalibrierung. ${deviceLimit?.limited ? deviceLimit.action + ' ' : ''} ${electrodeCompatibilityText}  ${calibrationText} Aktive Feinkorrektur: ${round(manualTrim + feedbackTrim)} %. ${heatInput !== null ? `Rechnerischer Wärmeeintrag: ${round(heatInput, 2)} kJ/mm bei ${round(travelSpeed)} mm/min.` : ''} ${manufacturerSummary}`
  };
}
