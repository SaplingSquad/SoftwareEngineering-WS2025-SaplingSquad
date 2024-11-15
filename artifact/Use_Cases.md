## Blickwinkel Spender

### Finde passende Vereine

- **Use Case Name:** Finde passende Vereine
- **Level:** User-Goal, Primär
- **Primärer Akteur:** Person
- **Stakeholders:**
    - *Vereine:* Wollen Person als Spender gewinnen und über ihre Projekte informieren
    - *Person:* Möchte mit minimalem Aufwand einen passenden Verein bzw. passende Projekte finden
- **Vorbedingungen:**
    - Person hat bereits genug Interesse an dem Thema *spenden* um die Website zu besuchen
    - Verein(e) sind registriert
    - Projekt(e) sind eingetragen
- **Nachbedingungen:**
    - Person hat Matches gefunden
    - Person wurde an Verein weitergeleitet
- **Auslöser:**
    - Person besucht Sprout Website
- **Haupterfolgsszenario:**
    1. Fragen beantworten
    2. Projekte und Vereine auf Karte ansehen
    3. Projekt anklicken, um detaillierte Beschreibung des Projekts zu lesen
    4. Vereinsname anklicken, um detaillierte Beschreibung des Vereins zu lesen
    5. Vereinslink aufrufen
- **Erweiterungen:**
    - \*a) Jederzeit bei Verbindungsabbruch:
        - Persistente Aktionen nicht mehr möglich, Benachrichtigung durch Webseite bei Fehlschlag
        - Lokale Interaktionen nicht zuverlässig möglich, Benachrichtigung durch Webseite soweit möglich
    - 1a) Fragen überspringen
    - 4a) Projekt hat nicht gefallen
        1. Projektansicht schliessen
        2. Zurück zu 2.
    - 5a) Verein hat nicht gefallen
        1. Vereinsansicht schliessen
        2. Projektansicht schliessen
        3. Zurück zu 2.
    - 2a) Projekt über Suchfeld suchen
    - 3a) Bestimmtes Projekt suchen
        1. Projektbezeichnung ins Suchfeld eintragen
        2. Projekt anklicken, um detaillierte Beschreibung des Projekts zu lesen
- **Spezielle Anforderungen:** /
- **Technologie:**
    - Zu 2:
        - Interaktion mit Karte sowohl über Maus als auch über Gestensteuerung möglich.
- **Häufigkeit:** Häufig
- **Sonstiges:**
    - Kompatibilität mit verschiedenen Browsern
    - Barrierefreiheit

### Entdecke Informationen auf Karte

- **Use Case Name:** Entdecke Informationen auf Karte
- **Level:** User-Goal, Primär
- **Primärer Akteur:** Person
- **Stakeholders:**
    - *Vereine:* Wollen awareness für gemeinsame Ziele schaffen/vergrößern
    - *Person:* Möchte leicht Informationen über Projekte, Vereine, Regionale Bedingungen und Gegebenheiten erhalten
- **Vorbedingungen:**
    - Person hat bereits genug Interesse an dem Thema *spenden* um die Website zu besuchen
    - Verein(e) sind registriert
    - Projekt(e) sind eingetragen
    - Informationen zu Regionen sind eingetragen
- **Nachbedingungen:**
    - Person wurde über Projekte, Vereine, regionale Bedingungen und Gegebenheiten informiert
- **Auslöser:**
    - Person kommt auf die Weltkarte der Sprout Website
- **Haupterfolgsszenario:**
    1. Person scrollt auf Karte nach belieben, Pins (Projekt, Verein oder Region) werden als Cluster angezeigt
    2. Person zoomt, Cluster werden nach Möglichkeit aufgeteilt
    3. Person klickt auf individuelle Pins und erhält entsprechende Informationen
    4. Person verlässt individuelle Sicht
    - Person wiederholt die Schritte 1-4, bis sie keine weiteren Informationen mehr erkunden möchte
- **Erweiterungen:**
    - \*a) Jederzeit bei Verbindungsabbruch:
        - Lokale Interaktionen nicht zuverlässig möglich, Verbindung muss für weitere Verwendung wiederhergestellt werden
- **Spezielle Anforderungen:** /
- **Technologie:**
    - Interaktion mit Karte sowohl über Maus als auch über Gestensteuerung möglich.
- **Häufigkeit:** Sehr häufig
- **Sonstiges:**
    - Kompatibilität mit verschiedenen Browsern
    - Barrierefreiheit


### Vereine/Projekte speichern

- **Use Case Name:** Speichere Vereine/Projekte
- **Level:** User-Goal, Sekundär
- **Primärer Akteur:** Person
- **Stakeholders:**
    - *Vereine:* Wollen Person als Spender gewinnen und über ihre Projekte informieren
    - *Person:* Möchte interessante Projekte und Vereine verfolgen und leicht wiederfinden
- **Vorbedingungen:**
    - Person ist registriert und eingeloggt
    - Verein(e) sind registriert
    - Projekt(e) sind eingetragen
- **Nachbedingungen:**
    - Person hat Verein/Projekt gespeichert
    - Person kann Verein/Projekt leicht wiederfinden
- **Auslöser:**
    - Person besucht Sprout Website
- **Haupterfolgsszenario:**
    1. Projekte und Vereine auf Karte ansehen
    2. Projekt anklicken, um detaillierte Beschreibung des Projekts zu lesen
    3. Projekt zu Lesezeichen hinzufügen
    4. Vereinsname anklicken, um detaillierte Beschreibung des Vereins zu lesen
    5. Verein zu Lesezeichen hinzufügen
    6. Lesezeichenliste aufrufen und gespeicherte Vereine/Projekte begutachten
- **Erweiterungen:**
    - \*a) Jederzeit bei Verbindungsabbruch:
        - Persistente Aktionen nicht mehr möglich, Benachrichtigung durch Webseite bei Fehlschlag
        - Lokale Interaktionen nicht zuverlässig möglich, Benachrichtigung durch Webseite soweit möglich
    - 3a) Schritt überspringen (d.h. nur einen Verein speichern)
    - 4-5a) Schritte überspringen (d.h. nur ein Projekt speichern)
    - 1-5a) Schritte überspringen (d.h. Lesezeichenliste direkt aufrufen)
    - 6a) Schritt überspringen (d.h. nach dem Speichern von Vereinen/Projekten Lesezeichenliste nicht aufrufen)
- **Spezielle Anforderungen:** /
- **Technologie:**
    - Zu 1:
        - Interaktion mit Karte sowohl über Maus als auch über Gestensteuerung möglich.
        - Referenz zu Use-Case *Finde passende Vereine*
- **Häufigkeit:** Gelegentlich
- **Sonstiges:**
    - Kompatibilität mit verschiedenen Browsern
    - Barrierefreiheit

## Blickwinkel Vereine

### Verein registrieren

- **Use Case Name:** Registriere einen Verein
- **Level:** User-Goal, Sekundär
- **Primärer Akteur:** Verein
- **Stakeholders:**
    - *Vereine:* Wollen Person als Spender gewinnen und über ihren Verein informieren
    - *Spender:* Möchte aktuelle und zuverlässige Informationen über Vereine
- **Vorbedingungen:**
    - Verein ist ein zugelassener/eingetragener, gemeinnütziger Verein
- **Nachbedingungen:**
    - Verein wird mit aktuellen Informationen auf der Karte von Sprout angezeigt
- **Auslöser:**
    - Verein besucht Sprout Website
- **Haupterfolgsszenario:**
    1. Navigiere zur Seite für Registrierung von Vereinen
    2. Informationen zum Verein eingeben
    3. Verein verifizieren
    4. Verein bearbeiten
- **Erweiterungen:**
    - \*a) Jederzeit bei Verbindungsabbruch:
        - Zum Speichern der Registrierung/Änderungen muss eine Verbindung wiederhergestellt werden
    - 1-3a) Schritte überspringen (d.h. Verein nur bearbeiten)
- **Spezielle Anforderungen:**
    - Ueberpruefung der eingegeben Daten z.B. valide IBAN
    - Verifikation der Vereinsidentität und der Gemeinnützigkeit
    - Hilfe mit Links zu Platformen, die bei Darstellung der Informationen helfen
- **Technologie:** /
- **Häufigkeit:** Selten
- **Sonstiges:**
    - Kompatibilität mit verschiedenen Browsern
    - Barrierefreiheit

### Projekt eintragen

- **Use Case Name:** Trage Projekt ein
- **Level:** User-Goal, Sekundär
- **Primärer Akteur:** Verein
- **Stakeholders:**
    - *Vereine:* Wollen Person als Spender gewinnen und über ihre Projekte informieren
    - *Spender:* Möchte aktuelle und zuverlässige Informationen über Projekte
- **Vorbedingungen:**
    - Verein ist ein zugelassener/eingetragener, gemeinnütziger Verein
- **Nachbedingungen:**
    - Projekte des Vereins werden mit aktuellen Informationen auf der Karte von Sprout angezeigt
- **Auslöser:**
    - Verein besucht Sprout Website
- **Haupterfolgsszenario:**
    1. Navigiere zur Seite für Vereinsverwaltung
    2. Projekt erstellen
    3. Projektinformationen eingeben
- **Erweiterungen:**
    - \*a) Jederzeit bei Verbindungsabbruch:
        - Zum Speichern der Eintragung/Änderungen muss eine Verbindung wiederhergestellt werden
    - 2a) Schritt überspringen (d.h. Projekt nur bearbeiten)
- **Spezielle Anforderungen:**
    - Informationen sollen Text, Tags, Bilder und eventuell Videos beinhalten
    - Hilfe mit Links zu Platformen, die bei Darstellung der Informationen helfen
- **Technologie:** /
- **Häufigkeit:** Gelegentlich
- **Sonstiges:**
    - Kompatibilität mit verschiedenen Browsern
    - Barrierefreiheit
