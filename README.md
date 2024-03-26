# backend_tools - Das Backend für : * Tools * - Die Ausleihkiste 

## Entwicklungsumgebung

### Voraussetzungen zur Installation

- [node.js](nodejs.org) Version 20.10.0 (andere Versionen nicht geprüft)
- PostgreSQL-Datenbank Version 14.11 (andere versionen nicht geprüft)

### Anleitung zur Installation

- Das Repository backend_tools clonen, zu finden unter: [backend_tools](https://github.com/eliseHtw/backend_tools.git).
- Im eigenen Terminal in das Projektverzeichnis backend_tools navigieren.
- Um die benötigten node-modules zu installieren: `npm install <entsprechendes-node-module-einsetzen>` ausführen. Die Module sind in der [package.json](https://github.com/eliseHtw/backend_tools/blob/main/package.json) zu finden.
- Eine eigene PostgreSQL-Datenbank erstellen.
- Im Wurzelverzeichnis des backend_tools-Verzeichnisses eine `.env` Datei erstellen. 
- Die Umgebungsvariablen als Verbindung zur Datenbank in der `.env` Datei erstellen:
```env
    PGUSER=Benutzer*in_der_eigenen_Datenbank
    PGHOST=Servername/-IP-Adresse_der_eigenen_Datenbank
    PGDATABASE=Name_der_eigenen_Datenbank(z.B._tools)
    PGPASSWORD=Passwort_der_eigenen_Datenbank
    PGPORT=Port_der_eigenen_Datenbank.
```
- Den Backend-Server starten: `npm run start`. Wenn das Backend erfolgreich gestartet wurde, sollte es dann so aussehen:  
![backend_started](https://github.com/eliseHtw/backend_tools/blob/main/images_readme/backend_started.png)
- Der Server ist dann unter `localhost:4000` erreichbar, z.B. im Browser: [http://localhost:4000](http://localhost:4000). Dort kann dann zu [/tools](http://localhost:4000/tools) oder [/users](http://localhost:4000/users) navigiert werden
- Für die Neubefüllung der tools-Tabelle: `localhost:4000/init` ausführen (bereits vorhandene Einträge werden gelöscht). Für die Initialisierung der users-Tabelle: `localhost:4000/initUsers` (ohne Einträge, bisherige Einträge werden gelöscht).
- Weiter zum Frontend [frontend_tools](https://github.com/eliseHtw/frontend_tools.git)...