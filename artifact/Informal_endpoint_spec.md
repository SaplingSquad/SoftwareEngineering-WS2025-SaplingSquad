# Grobe API-Spezifikation
- Format: Typ Name (request parameters) -> (response parameters)
- Der userToken dient zur Authentisierung und Autorisierung von Operationen
- In requests werden Bilder mitgesendet, in responses werden urls der Speicherorte gesendet (?)
- Format des Filters ist noch offen.
- Antworten auf Fragen sind positiv/neutral/negativ, Format ist noch offen.

Init
- Post Benutzer (username, password, icon) -> ()
- Post Benutzer/token (username, password) -> (userToken)
- Get Benutzer (userToken) -> (name, iconUrl)

Fragen
- Get Fragen () -> (list(questionId, questionText, questionImageUrl))
- Post Antworten (userToken, list(questionId, answer)) -> ()
- Get Filter (userToken) -> (filter)

Karte
- Get Vereine () -> (list(orgId, location))
- Get Verein (orgId) -> (orgId, title, description, list(imageUrl), webpageUrl, project, donatePageUrl)
- Get Vereine (list(orgId)) -> list(orgId, title, description, list(imageUrl), webpageUrl, project, donatePageUrl)

- Get Projekte () -> list(projectId, location)
- Get Projekt (projectId) -> (projectId, title, description, list(imageUrl), webpageUrl, donatePageUrl)
- Get Projekte (list(projectId)) -> list(projectId, title, description, list(imageUrl), webpageUrl, donatePageUrl)

- Get Regionen () -> list(regionId, name, location)
- Get Region (regionId) -> (regionId, name, description, list(imageUrl), webpageUrl)

Lesezeichen
- Post ProjektLesezeichen (userToken, projectId) -> ()
- Post VereinLesezeichen (userToken, orgId) -> ()
- Delete ProjektLesezeichen (userToken, projectId) -> ()
- Delete VereinLesezeichen (userToken, orgId) -> ()

Vereine
- Post Verein (userToken, title, description, list(image), webpageUrl, project, donatePageUrl) -> ()
- Put Verein (userToken, orgId, title, description, list(imageUrl), webpageUrl, project, donatePageUrl) -> ()
- Post Projekt (userToken, orgId, title, description, list(image), webpageUrl, donatePageUrl) -> ()
- Put Projekt (userToken, projectId, title, description, list(imageUrl), webpageUrl, donatePageUrl) -> ()
