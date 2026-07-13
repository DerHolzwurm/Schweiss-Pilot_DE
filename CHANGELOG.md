
## 1.0.2-C12 - Development

### Added
- WIG-DC-Kategorie in der Fehlerdiagnose.
- Zusätzliche Fehlerbilder zu Bindefehlern, Einbrandkerben, Spritzern, Verzug, Wolframverunreinigung, Gasabdeckung, Schlackeneinschlüssen und Plasmaschnitt-Grat.
- Eintragsbezogene Quellenkennzeichnung zur klaren Trennung zwischen CTM-250-Handbuch und allgemeiner Schweißpraxis.

### Changed
- Suchbereich und Einleitung der Fehlerdiagnose erweitert.
- Datenstatus, README, Version und Service-Worker-Cache auf Build C12 aktualisiert.

### Files
- README.md
- CHANGELOG.md
- index.html
- version.json
- sw.js
- css/components.css
- data/troubleshooting.json
- js/features/diagnostics.js

## 1.0.2 – C11

### Added
- Erweiterte technische Detailspalte in den vorhandenen STAHLWERK-Hersteller-Richtwerten.
- Anzeige bereits hinterlegter Angaben zu Wolframelektrode, Gasdüse, Zusatzstab sowie Elektrodentyp und -durchmesser.

### Changed
- README, Datenstatus, Versionsstand und Offline-Cache auf Build C11 aktualisiert.
- Keine Berechnungsformeln oder Herstellerwerte verändert.

## 1.0.2 – C10

- Herstellerdatensätze werden bei Mehrfachtreffern nach Materialstärke, Stromnähe, Draht- beziehungsweise Elektrodendurchmesser und Datensatzspezifität priorisiert.
- Die Kalibrierung nutzt für die Referenzauswahl nun den geometrisch korrigierten Strombedarf statt nur den unveränderten Formelgrundstrom.
- Herstellervergleich zeigt die Qualität der Zuordnung und den zugehörigen Materialbereich transparent an.
- Bestehende Herstellerwerte, Berechnungsformeln und Gerätegrenzen bleiben unverändert.
- README, Datenstatus, Versionsstand und Offline-Cache auf Build C10 aktualisiert.

# Changelog

## 1.0.2 – C09

- Aufklappbaren Berechnungsweg im Ergebnisbereich ergänzt.
- Eingabegrundlage, Verfahrens-Grundstrom, Geometrie- und Positionsfaktoren sowie Kalibrierkorridor werden schrittweise ausgewiesen.
- Feinkorrektur, Gerätelimit, Spannung, Drahtvorschub, Schweißgeschwindigkeit und Wärmeeintrag werden mit Zwischenwerten transparent dargestellt.
- Rundungen betreffen ausschließlich die Anzeige; die vorhandenen Berechnungsformeln und Herstellerwerte bleiben unverändert.
- Doppelten Titel im Parameter-Tab bereinigt.
- README, Datenstatus, Versionsstand und Offline-Cache auf Build C09 aktualisiert.

## 1.0.2 – C08

- Transparente Berechnungsprüfung im Ergebnisbereich ergänzt.
- Stromwert, Kalibrierkorridor, Gerätelimit, Spannung, Drahtvorschub, Schweißgeschwindigkeit und Wärmeeintrag werden auf verwertbare Rechenergebnisse geprüft.
- Verwendete Herstellerkalibrierung beziehungsweise generische Datenbasis wird ausdrücklich ausgewiesen.
- Keine Berechnungsformel und kein Herstellerwert wurde verändert.
- README, Datenstatus, Versionsstand und Offline-Cache auf Build C08 aktualisiert.

## 1.0.2 – C07

- Geräte- und Verfahrensdaten in die zentrale Datei `data/devices.json` ausgelagert.
- Einheitlichen Gerätezugriff über `js/core/device-manager.js` ergänzt.
- Prozessreferenzen für CUT, FLUX, MAG, MIG Aluminium, MMA und WIG DC integriert.
- Datenladeweg, Offline-Cache, README und Datenstatus auf Build C07 aktualisiert.
- Keine vorhandenen Berechnungs- oder Herstellerwerte verändert.

## 1.0.2 – C05

- Quellen- und Validierungsstatus für jeden Hersteller-Richtwert im Parameter-Tab ergänzt.
- Direkte Handbuchwerte und ausdrücklich gekennzeichnete Ableitungen werden visuell unterschieden.
- Quellenbezeichnung, relevante Handbuchseiten und Anzahl der Ableitungen werden verfahrensbezogen angezeigt.
- Bestehende Herstellerwerte bleiben unverändert; es wurden keine neuen Schweißparameter erzeugt.
- README, Datenstatus, Versionsstand und Offline-Cache auf C05 aktualisiert.

## 1.0.2 – C04

- Verfahrensbezogene Ausgangsstrombereiche des aktiven Geräteprofils im Parameter-Tab ergänzt.
- Einschaltdauer bei 40 °C und Plasma-Arbeitsdruck werden passend zum gewählten Verfahren angezeigt.
- Netzversorgung sowie maximaler und effektiver Eingangsstrom aus dem zentralen Geräteprofil ergänzt.
- Validierte Geräteeinschränkungen werden transparent und datengetrieben dargestellt.
- README, Datenstatus, Versionsstand und Offline-Cache auf C04 aktualisiert.

## 1.0.2 – C03

- Gewähltes Verfahren kann aus dem Parameter-Tab direkt in den Rechner übernommen werden.
- Bestehende Rechnerlogik aktualisiert nach der Übergabe automatisch die verfahrensabhängigen Eingabefelder.
- Material und weitere Nutzereingaben bleiben bei der Übergabe erhalten, sofern die Rechnerlogik keine verfahrensbedingte Korrektur verlangt.
- Übergabeschaltfläche mit dynamischem Verfahrenstext und sicherer Verfügbarkeitsprüfung ergänzt.
- Datenstatus, README, Versionsstand und Offline-Cache auf C03 aktualisiert.

## 1.0.2 – C02

- Geräte- und Verfahrensauswahl im Parameter-Tab wird lokal gespeichert.
- Gültige Auswahl wird beim nächsten App-Start automatisch wiederhergestellt.
- Lokale Speicherung gegen blockierten oder nicht verfügbaren Browser-Speicher abgesichert.
- Datenstatus-Text bereinigt und auf Build C02 aktualisiert.
- README auf Version 1.0.2 und den aktuellen Entwicklungsbranch gebracht.
- Service-Worker-Cache auf C02 erhöht.

## 1.0.2 – C01

- Neuer Tab „Parameter“ zwischen Rechner und Lexikon.
- Modulare Geräte- und Verfahrensauswahl für STAHLWERK CTM-250 Puls Pro.
- Anschlussbilder für CUT, FLUX, MIG/MAG, MMA und WIG integriert.
- Anschlussbelegung, Verfahrensparameter und Einrichtungsabläufe datengetrieben ergänzt.
- Vorhandene Hersteller-Richtwerte werden verfahrensbezogen aus der bestehenden Datenbank angezeigt.
- Sicherheitswarnung aus der Bedienungsanleitung eingebunden.

## Build C15

### Changed
- Herstellerdaten für Version 1.0.1 auf STAHLWERK begrenzt.
- Fremdhersteller-Platzhalter und nicht herstellerbelegte Seed-Datensätze entfernt.
- CTM-250-Geräteprofil gegen die Bedienungsanleitung validiert.
- WIG AC aus dem CTM-250-Geräteprofil entfernt, da das Gerät ausschließlich DC WIG unterstützt.
- Herstellervergleich auf STAHLWERK festgelegt; Ein-/Ausblenden bleibt möglich.
- README mit Funktionsumfang, Änderungen seit 1.0.0, Quellenbasis und bekannten Grenzen vollständig aktualisiert.

### Validated
- MIG/MAG-Richtwerte 1–7 mm.
- MMA-Elektrodenbereiche 1,6–5,0 mm.
- WIG-DC-Richtwerte für Stahl und Edelstahl.
- Ausgangsströme, Einschaltdauer und Plasma-Arbeitsdruck des CTM-250 Puls Pro.

## Build C14

- Illustrationssystem abschließend vereinheitlicht.
- Pfeilspitzen werden direkt als grüne SVG-Flächen gezeichnet und sind auch im Lexikon zuverlässig sichtbar.
- Richtungspfeile liegen oberhalb des Brenners und sind dezenter ausgeführt.
- Stumpfnaht wird als gefüllter Spalt, Kehlnaht als Viertelkreis dargestellt.
- Brenner und Lichtbogen wurden in den Nahtarten ergänzt; Fasen zeigen nun gefüllte Querschnitte.

## Build C13

- Fehlerdiagnose anhand der FAQ des STAHLWERK CTM-250 Puls Pro strukturiert erweitert.
- Filter nach Verfahren und Volltextsuche ergänzt.
- Ursachen, sichere Prüfschritte, Priorität und Quellenstellen werden je Fehlerbild angezeigt.
- Neue Datenquelle `data/troubleshooting.json` und Offline-Cache für die Diagnose ergänzt.

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
