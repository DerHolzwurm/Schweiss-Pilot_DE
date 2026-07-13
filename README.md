# SchweißPilot

**Version 1.0.2 · Build C04 · Development**

Offlinefähiger Schweißparameter-Assistent als Progressive Web App. SchweißPilot ermittelt praxisnahe Startwerte, visualisiert Schweißsituationen und stellt gerätebezogene Anschluss- und Parameterinformationen bereit.

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

### Parameter

Der Tab **Parameter** enthält derzeit das Geräteprofil:

- STAHLWERK CTM-250 Puls Pro

Verfügbar sind gerätebezogene Anschlussbilder und Hinweise für:

- CUT / Plasmaschneiden
- FLUX / selbstschützender Fülldraht
- MAG / Stahl
- MIG / Aluminium
- MMA / Elektrode
- WIG DC / Stahl und Edelstahl

Die zuletzt gewählte Geräte- und Verfahrenskombination wird lokal gespeichert und beim nächsten App-Start wiederhergestellt. Das ausgewählte Verfahren kann direkt in den Rechner übernommen werden; die vorhandene Rechnerlogik aktualisiert anschließend die verfahrensabhängigen Eingabefelder. Vorhandene Hersteller-Richtwerte werden aus der zentralen Herstellerdatenbank eingebunden; fehlende Werte bleiben bewusst leer. Zusätzlich zeigt der Tab verfahrensbezogene Gerätegrenzen, Einschaltdauer, Netz- und Eingangsstromdaten sowie die im Geräteprofil dokumentierten Einschränkungen.

### Hersteller- und Gerätebezug

Für Version 1.0.2 sind ausschließlich Herstellerdaten des **STAHLWERK CTM-250 Puls Pro** freigegeben. Die Richtwerte stammen aus der Bedienungsanleitung, Stand 05/2025.

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

## Entwicklung Version 1.0.2

| Build | Schwerpunkt |
|---|---|
| C01 | Neuer datengetriebener Parameter-Tab mit Geräte- und Verfahrensauswahl |
| C02 | Persistente Parameter-Auswahl, Datenstatus-Bereinigung und Dokumentationsabgleich |
| C03 | Direkte Übernahme des gewählten Verfahrens aus dem Parameter-Tab in den Rechner |
| C04 | Gerätegrenzen, technische Gerätedaten und validierte Einschränkungen im Parameter-Tab |

## Bekannte Grenzen

- Herstellerwerte sind Start- und Orientierungswerte, keine Schweißanweisung.
- Das STAHLWERK-Handbuch enthält für MIG/MAG keine Spannungs- oder Drahtvorschubtabellen. Diese Werte bleiben rechnerische Empfehlungen.
- Für Plasma liegt keine materialdickenabhängige Stromtabelle des Herstellers vor; validiert sind nur Gerätebereich und Luftdruck.
- Fülldraht gasgeschützt, AC-WIG-Geräteprofile und weitere Hersteller sind noch nicht freigegeben.
- Elektrodenverpackung, Zusatzwerkstoffdaten, Polarität, Probenaht und Arbeitsschutz haben Vorrang.

## Entwicklung

Aktueller Branch:

```text
Entwicklung-V1.0.2
```

Vorgesehene Merge-Reihenfolge:

```text
Entwicklung-V1.0.2 -> develop -> main -> tag v1.0.2
```

## Roadmap Version 1.0.2

- Berechnungsengine anhand der endgültigen Projektformeln validieren
- Werte gegen das STAHLWERK-Handbuch prüfen
- Spannungen, Drahtvorschub und Wärmeeintrag plausibilisieren
- weitere STAHLWERK-Daten integrieren
- Herstellerdatenbank und Vergleich erweitern
- zusätzliche Fehlerbilder und Plausibilitätsprüfungen ergänzen

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
