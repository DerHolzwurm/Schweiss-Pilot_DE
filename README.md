# SchweißPilot

**Version 1.0.1 · Build C15 · Release Candidate**

Offlinefähiger Schweißparameter-Assistent als Progressive Web App. SchweißPilot ermittelt praxisnahe Startwerte, visualisiert Schweißsituationen und gleicht Ergebnisse optional mit validierten Richtwerten des **STAHLWERK CTM-250 Puls Pro** ab.

## Funktionen

### Rechner

- MAG und MIG
- MIG Aluminium
- WIG DC sowie allgemeine WIG-AC-Berechnung
- Elektrode/MMA mit Elektrodendurchmesser als Referenz
- Fülldraht selbstschützend
- Plasmaschneiden
- Strom, Spannung, Drahtvorschub, Schweißgeschwindigkeit und Wärmeeintrag
- Live-Nahtfeedback und Feinkorrektur
- Gerätelimits mit transparenten Warnhinweisen

### Hersteller- und Gerätebezug

Für Version 1.0.1 sind ausschließlich Herstellerdaten des **STAHLWERK CTM-250 Puls Pro** freigegeben. Die Richtwerte stammen aus der Bedienungsanleitung, Stand 05/2025.

Validiert wurden:

- MIG/MAG-Richtwerte für 1–7 mm Materialstärke
- MMA-Richtwerte für Elektroden von 1,6–5,0 mm
- WIG-DC-Richtwerte für Stahl und Edelstahl
- Gerätegrenzen: MIG 50–200 A, MMA 20–200 A, WIG 20–200 A, CUT 15–45 A
- Plasma-Arbeitsdruck 3,5–4,0 bar
- Einschaltdauer und elektrische Gerätedaten

**Wichtig:** Das CTM-250 Puls Pro unterstützt laut Handbuch kein AC-WIG. Aluminium ist am Gerät über MIG/PMIG-Puls vorgesehen. Allgemeine WIG-AC-Berechnungen der App erhalten deshalb keinen STAHLWERK-Vergleich.

### Lexikon und Visualisierung

- Nahtarten, Materialformen und Schweißpositionen
- Fasen- und Mehrlagendarstellungen
- Schweißrichtung, Brenner, Lichtbogen und Nahtdarstellung
- einheitliches Farbsystem

### Diagnose

- durchsuchbares Troubleshooting
- Filter nach Verfahren
- Ursachen und sichere Prüfschritte
- CTM-250-FAQ als strukturierte Datenbasis

### Progressive Web App

- installierbar
- offlinefähig
- responsiv
- Dark Mode
- Service Worker und Manifest

## Änderungen seit Version 1.0.0

| Build | Schwerpunkt |
|---|---|
| C01 | Referenzwerte, Slider und empfohlene Einstellungen |
| C02 | Version, Build, Branch und Status |
| C03 | Nahtarten, Materialformen und Illustrationssystem |
| C04 | vereinfachter Plasma-Workflow |
| C05/C05a | Info-Buttons, Tooltips und globaler Hilfeschalter |
| C06 | erweiterte Berechnungs- und Referenzstruktur |
| C07/C07.5 | Herstellerdatenbank und CTM-250-Geräteprofil |
| C08 | Vergleich berechneter Werte mit Herstellerbereichen |
| C09 | neue modulare Berechnungsengine |
| C10/C10.5 | MMA-Elektrodendurchmesser und empfohlene Materialstärke |
| C11 | Gerätelimits und Warnhinweise |
| C12 | optionaler Herstellervergleich |
| C13 | CTM-250-Troubleshooting |
| C14 | finale Überarbeitung der Illustrationen |
| C15 | Validierung und Begrenzung der Herstellerdaten auf STAHLWERK |

## Bekannte Grenzen

- Herstellerwerte sind Start- und Orientierungswerte, keine Schweißanweisung.
- Das STAHLWERK-Handbuch enthält für MIG/MAG keine Spannungs- oder Drahtvorschubtabellen. Diese Werte bleiben rechnerische Empfehlungen.
- Für Plasma liegt keine materialdickenabhängige Stromtabelle des Herstellers vor; validiert sind nur Gerätebereich und Luftdruck.
- Fülldraht gasgeschützt, AC-WIG-Geräteprofile und weitere Hersteller sind noch nicht freigegeben.
- Elektrodenverpackung, Zusatzwerkstoffdaten, Polarität, Probenaht und Arbeitsschutz haben Vorrang.

## Entwicklung

Aktueller Branch:

```text
Entwicklung-V1.0.1
```

Merge-Reihenfolge:

```text
Entwicklung-V1.0.1 -> develop -> main -> tag v1.0.1
```

## Roadmap Version 1.1.0

- Favoriten
- Materialdatenbank
- PDF-Export
- Historie
- persönliche Schweißbibliothek
- eigene Parameter
- eigene Fotos
- eigene Notizen

## Quellenbasis

- STAHLWERK CTM-250 Puls Pro Bedienungsanleitung, Stand 05/2025
- projektinterne Berechnungs- und Referenzdokumentation

## Hinweis

SchweißPilot ersetzt weder fachgerechte Ausbildung noch Herstellerangaben, Schweißanweisungen oder eine Probenaht.
