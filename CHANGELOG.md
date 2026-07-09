
## v1.0.1 – In Entwicklung

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
