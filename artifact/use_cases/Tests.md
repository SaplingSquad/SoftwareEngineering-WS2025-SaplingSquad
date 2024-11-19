## Projekt und Verein über Karte finden

Hinweis: Gleiche Schritte bei den Slices zu einem Use Case haben je den gleichen
Test. Nennung nur beim ersten mal zwecks Wartbarkeit.

- Finde passende Vereine - einfacher Durchlauf: 1, 2, 3, 4, 5
    - 1 Fragen Katalog anzeigen, Frage beantworten
    - 2 Übergang Fragen zu Karte, Scrollen auf Karte
    - 3 Projekt-Pin auswählen, Projekt Seite anzeigen
    - 4 Vereinsinfo von Seite des Projekts aufrufen
    - 5 Weiterleitung auf Website des Vereins
- Finde passende Vereine - ohne Fragen: 1a, 2, 3, 4, 5
    - 1a) Überspringen der Fragen
- Finde passende Vereine - erster Verein unpassend: 1, 2, 3, 4a, 2, 3, 4, 5
    - 4a) Zurück zur Karte
- Finde passende Vereine - erstes Projekt unpassend: 1, 2, 3, 4, 5a, 2, 3, 4, 5
    - 5a) Zurück zur Ansicht des Projekts, Zurück zur Karte

## Projekt und Verein über Suchfeld finden

- Finde passende Vereine - über Suchfeld: 1, 2a, 3, 4, 5
    - 2a) Eingabe eines existierenden Projektes im Suchfeld, Eingabe eines nicht
      existierenden Projektes im Suchfeld
- Finde passende Vereine - über Suchfeld: 1, 2-3b, 4, 5
    - 2-3b) Eingabe eines existierenden Vereins im Suchfeld, Eingabe eines nicht
      existierenden Vereins im Suchfeld

## Karteninteraktion

- Informationen auf Karte entdecken - einfacher Durchlauf: 1, 2, 3, 4
    - 1 Scrollen und Anzeige von Clustern
    - 2 Zoom per Gesten und Slider, Aufsplitten der Cluster
    - 3 Interaktion mit allen Typen Pins, Öffnen der korrespondierenden
    Informationen
    - 4 Schliessen aller Typen Informationsfenster
- Informationen auf Karte entdecken - wiederholter Durchlauf: 1, 2, 3, 4, 1, 2, 3, 4
- Informationen auf Karte entdecken - Verbindungsabbruch: 1, 2x, ?
    - 2x) Verbindung extern unterbinden, Anzeige von Meldung prüfen

## Vereine/Projekte speichern

- Speichere Vereine/Projekte - einfacher Durchlauf: 1, 2, 3, 4, 5, 6
    - 1 siehe *Finde passende Vereine 2*
    - 2 siehe *Finde passende Vereine 3*
    - 3 Lesezeichen bei Projekt setzen
    - 4 siehe *Finde passende Vereine 4*
    - 5 Lesezeichen bei Verein setzen
    - 6 Lesezeichenliste aufrufen, prüfen ob die Einträge erreichbar sind,
    Testen, dass ein abgeschlossenes Projekt in der Liste bleibt
- Speichere Vereine/Projekte - Lesezeichenliste direkt aufrufen: 1-5b, 6
    - 6 Lesezeichenliste nicht aufrufen
    - 1-5b) Lesezeichenliste in neuer Session aufrufen

## Verein eintragen

- Verein eintragen - einfacher Durchlauf: 1, 2, 3, 4
    - 1 Seite zur Registrierung aufrufen
    - 2 Alle Felder zur Registrierung ausfüllen, korrekt und "inkorrekt"
    - 3 Prozess zur Verifikation durchlaufen
    - 4 Informationen einzeln Bearbeiten, Informationen im Batch bearbeiten

## Verein bearbeiten

- Verein eintragen - bearbeiten: 4

## Projekt eintragen

- Projekt eintragen - einfacher Durchlauf: 1, 2, 3
    - 1 Navigation zur Vereinsverwaltung als eingeloggter Verein, als eingeloggte
      Person und als nicht eingeloggter User
    - 2 Eintragen eines neuen Projektes, eintragen eines bereits existierenden
    Projektes im Hinblick auf Namen und Ort
    - 3 Vollständige Eingabe der geforderten Informationen, unvollständige
    Eingabe der geforderten Informationen

## Projekt bearbeiten

- Projekt eintragen - bearbeiten: 3
