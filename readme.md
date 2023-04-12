# Fotodatenbank

## Team 7:
- 8509440
- 2759750
- 6772873

## Technologie:
- Frontend: React + ASP.NET
- Backend: (ASP).NET
- DB: MongoDb
  
## Start:
Im Hauptordner "docker-compose up" ausführen.
Danach ist die Website unter http://localhost:50000 und die API unter http://localhost:50001 erreichbar.
(Der erste Start kann durch die riesigen Images von Microsoft bis zu 15min dauern)

## Konfiguration:
Ports und Env-Variablen können in der docker-compose.override.yml geändert werden.
Bei der Website kann hier auch die Adresse zur API geändert werden, ohne die Application neu kompilieren zu müssen.

### Sonstiges:
Die docker-compose_win_local.yml wurde nur während der Entwicklung benötigt, um die Dateien auf einen lokalen Ordner zu speichern.

Alle Bild-Dateien werden im Filesystem unter /usr/share/picturedb gespeichert. Der Pfad ist ein Shared-Volumne von allen Containern.