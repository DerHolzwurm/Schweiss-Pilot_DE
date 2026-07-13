# Release-Prüfliste – SchweißPilot 1.0.2

**Build:** C15  
**Branch:** `Entwicklung-V1.0.2`  
**Status:** Release Candidate

## 1. Projektstand

- [ ] Vollständige C15-ZIP entpackt und vollständig auf GitHub hochgeladen
- [ ] Änderungen ausschließlich auf `Entwicklung-V1.0.2` committed
- [ ] `version.json` zeigt Version 1.0.2, Build C15 und Status Release Candidate
- [ ] Service-Worker-Cache lautet `schweisspilot-v1.0.2-c15`
- [ ] README und CHANGELOG entsprechen Build C15

## 2. GitHub Pages und PWA

- [ ] GitHub Pages lädt ohne Konsolenfehler
- [ ] Navigation zeigt Rechner, Parameter, Lexikon, Fehler und Daten in korrekter Reihenfolge
- [ ] App kann installiert werden
- [ ] App startet nach Installation korrekt
- [ ] Offline-Neustart funktioniert nach einmaligem vollständigem Online-Aufruf
- [ ] Aktualisierung von einem älteren Cache auf C15 funktioniert
- [ ] App-Symbole und Manifest werden korrekt geladen

## 3. Rechner

- [ ] MAG
- [ ] MIG
- [ ] MIG Aluminium
- [ ] WIG DC
- [ ] MMA
- [ ] Fülldraht selbstschützend
- [ ] Plasma
- [ ] Startwerte werden vollständig angezeigt
- [ ] Feinkorrektur und Nahtfeedback funktionieren
- [ ] Gerätelimits und Warnhinweise erscheinen nachvollziehbar
- [ ] Herstellervergleich lässt sich ein- und ausblenden
- [ ] Berechnungsprüfung und Berechnungsweg funktionieren

## 4. Parameter

- [ ] STAHLWERK CTM-250 Puls Pro ist auswählbar
- [ ] Alle hinterlegten Verfahren sind auswählbar
- [ ] Anschlussbilder werden korrekt geladen
- [ ] Parameter, Gerätegrenzen, Quellenstatus und Prozessreferenzen werden angezeigt
- [ ] Letzte Auswahl wird gespeichert und wiederhergestellt
- [ ] Übergabe des Verfahrens in den Rechner funktioniert

## 5. Weitere Module

- [ ] Lexikon lädt alle Einträge und Grafiken
- [ ] Rechner und Lexikon verwenden konsistente Grafiken
- [ ] Fehlerdiagnose: Suche und Verfahrensfilter funktionieren
- [ ] Daten-Tab zeigt Build C15 und Release-Candidate-Status korrekt
- [ ] Dark Mode und responsive Darstellung funktionieren

## 6. Abschluss

- [ ] Keine fehlenden Dateien oder 404-Aufrufe
- [ ] Keine JavaScript-Fehler in der Browserkonsole
- [ ] Test auf Desktop und Smartphone abgeschlossen
- [ ] Erst nach vollständiger Prüfung Merge nach `develop`
- [ ] Danach Merge nach `main` und Tag `v1.0.2`

## Abschluss C16

- [ ] Sicherheitsbestätigung für WIG DC, WIG AC, MMA und Plasma geprüft.
- [ ] Berechnungsprüfung ein- und ausgeblendet; gespeicherter Zustand geprüft.
- [ ] Naht-Rückmeldung auf Smartphone und Desktop geprüft.
- [ ] Parameterreihenfolge FLUX, MAG, MIG, WIG DC, WIG AC, MMA, Plasma geprüft.
- [ ] GitHub Pages und Offlinebetrieb mit Cache C16 geprüft.
