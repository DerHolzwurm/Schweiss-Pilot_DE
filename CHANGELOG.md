# Changelog

## 1.0.0 - 2026-07-09

### Added
- Neuaufbau der App-Grundstruktur.
- Modulare Verzeichnisstruktur mit core, ui und features.
- Schweißrechner mit konservativen Startwerten.
- Live-Nahtfeedback per Slider direkt im Ergebnisbereich.
- Sichtbare Versionsanzeige aus version.json.
- PWA-Manifest und Service Worker.
- Lexikon und Fehlerdiagnose.

### Fixed
- Fehlende oder falsche Script-Einbindungen vermieden.
- Navigationslogik vereinheitlicht.
- Slider berechnet Werte live neu.


## v1.0.0 UI alignment fix

- Moves Naht-Rückmeldung above A/V/Vorschub start values.
- Renames Empfohlener Startpunkt to Empfohlene Startwerte.
- Aligns A left, V centered and Vorschub m/min right.


### Fixed - UI Startwerte Alignment
- Moves Naht-Rückmeldung above the complete Startwerte block.
- Displays A, V and Vorschub m/min as three equal-sized primary values.
- Aligns A left, V centered and Vorschub right inside the Startwerte card.
