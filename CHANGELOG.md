## Build C12

- Herstellervergleich im Rechner optional ein- und ausblendbar.
- Vergleichsdaten können nach verfügbarem Hersteller gefiltert werden.
- Auswahl wird lokal gespeichert und beeinflusst weder Grundberechnung noch aktives Gerätelimit.
- Datenbank-Metadaten und Service-Worker-Cache auf C12 aktualisiert.

## Build C11

- Gerätelimits des STAHLWERK CTM-250 Puls Pro für MIG/MAG, Fülldraht, WIG, MMA und Plasma aktiviert.
- Stromausgabe wird auf den einstellbaren Gerätebereich begrenzt.
- Transparenter Warnhinweis zeigt berechneten Bedarf, begrenzte Ausgabe und Gerätebereich.


## 1.0.1-C03 - Development

### Added
- Kehlnaht illustrations for calculator and lexicon.
- Material form illustrations for calculator and lexicon.
- Central illustration metadata file.

### Changed
- Welding direction is now shown as a green arrow.
- Blue weld seam now ends exactly at the torch and arc position.
- Lexicon contains separate sections for positions, joint types and material forms.

### Files
- index.html
- css/components.css
- js/ui/visuals.js
- js/ui/results.js
- js/core/calculations.js
- data/illustrations.json
- version.json
- sw.js


## v1.0.1 – In Entwicklung


### Changed
- Versionsverwaltung erweitert: Version, Build, Branch und Status werden getrennt geführt.
- Versionsinformationen im Footer und im Info-Dialog sichtbar gemacht.
- Service-Worker-Cache auf Build C02 erhöht.

### Fixed
- Naht-Rückmeldung unter die empfohlenen Startwerte verschoben.
- Referenzwerte für Strom, Spannung und Vorschub ergänzt.
- Referenzwerte bleiben bei Slider-Anpassungen als Optimalwerte sichtbar.

# Changelog

## 1.0.0 - 2026-07-09

### Added
- Neuaufbau der App-Grundstruktur als PWA.
- Modulare Verzeichnisstruktur mit `core`, `ui` und `features`.
- Schweißrechner mit konservativen Startwerten.
- Live-Nahtfeedback per Slider im Ergebnisbereich.
- Sichtbare Versionsanzeige aus `version.json`.
- Service Worker für Offlinebetrieb.
- Lexikon mit Skizzen/Bildern.
- Fehlerdiagnose.
- Schweißpositionsskizzen.
- Fase- und Mehrlagenskizzen.
- Verfahren **Plasmaschneiden**.

### Changed
- Ergebnisbereich auf **Empfohlene Startwerte** umbenannt.
- Naht-Rückmeldung steht oberhalb der Startwerte.
- Startwerte als drei gleichwertige Hauptwerte dargestellt:
  - links: **A**
  - Mitte: **V**
  - rechts: **Vorschub m/min**
- Bezeichnungen A, V und m/min kleiner dargestellt als die Werte.
- Slider wirkt stufenweise über den gesamten Bereich von -10 bis +10.

### Removed
- Verfahren **Fülldraht gasgeschützt** entfernt.

### Fixed
- Fehlende/falsche Script-Einbindungen vermieden.
- Navigationslogik vereinheitlicht.
- Slider berechnet Werte live neu.
- Positionsbilder wieder eingebunden.
- Fase-/Nahtvorbereitungsskizzen wieder eingebunden.
- Lexikon-Bilder/Skizzen wieder eingebunden.
