# Playground

Sto cazzeggiando con `.NET 6`, `Angular 13` e `Docker`.

## Obiettivo

Costruire uno stack a caso e renderlo distribuibile via _docker_.

## Descrizione

Ho realizzato un editor di testo; non è altro che un pretesto per pubblicare qualcosa.

Di seguito le caratteristiche:

## Frontend

- Il frontend contiene un'area di testo.
- All'avvio scarica il testo dal backend.
- Ad ogni modifica del testo, invia al backend il testo aggiornato.

## Backend

- Conserva lo stato di una singola sessione.
- Espone il testo corrente.
- Riceve e aggiorna il testo modificato.

## Sito

Utilizzo il termine _app_ per indicare la web app statica (il _frontend_), e _site_ per indicare un servizio che espone la web app via _nginx_ o altro.

## Docker

La configurazione fa uso di `Dockerfile` e `docker compose` per compilare le immagini e lanciare lo stack.  
Sono disponibili diverse modalità di composizione ed esecuzione dello stack; i diversi file di configurazione e script si trovano nella cartella `docker`.

### Modalità _dev_

In questa modalità vengono usate le immagini originali di `dotnet-sdk` e `node` per lanciare i comandi `dotnet run` e `npm start` sui repo di sviluppo locali, che vengono montati (`type=bind`) sui container.

```
.\scripts\run-dev.ps1
```

Questo script genera uno _stack docker_ di nome `playground-dev`, composto da:

- `playground-db`: database _postgres_ in ascolto su `localhost:5432`;
- `playground-api`: backend _aspnet_ in ascolto su `localhost:5255`;
- `playground-site`: frontend _angular_ servito da `ng serve`, in ascolto su `localhost:4200`.

Nelle rispettive cartelle `.\playground-app\.vscode` e `.\PlaygroundApi\.vscode`, sono presenti le configurazioni per il debug di entrambi i progetti. Entrambi i debugger si agganciano ai container già avviati.

- In `PlaygroundApi`, lanciare il debug in modalità `Docker .NET Core Attach (Preview)` per agganciare il debugger al container `playground-api`.
- In `playground-app`, langiare il debug in modalità `Launch Edge`.

Se si vuole debuggare localmente senza usare _docker_, occorre modificare i seguenti hostname:

- In `playground-app\src\proxy.conf.json`, sostituire `playground-api` con `localhost`.
- In `PlaygroundApi\appsettings.json`, sostituire `playground-db` con `localhost`.

### Modalità _mount_

In questa modalità verrà creato un container che lavora sulle build create manualmente in locale; in questo modo è possibile avere un anteprima veloce del funzionamento dello stack `embed` (vedi sotto).

Le cartelle `dist\api` e `dist\app` vengono montate sui container dal repository locale dopo aver pubblicato manualmente entrambi i progetti.

```
.\scripts\run-mount.ps1
```

Questo script lancia localmente i comandi di pubblicazione, poi genera uno stack di nome `playground-mount`, composto da:

- `playground-db`: database _postgres_ in ascolto su rete docker `playground-network` sulla porta `5432`;
- `playground-api`: backend _aspnet_ in ascolto su rete docker `playground-network` sulla porta `5255`;
- `playground-site`: frontend _angular_ servito da _nginx_, in ascolto su `localhost` e nella rete docker `playground-network` sulla porta `80`.

### Modalità _embed_

Questa modalità produce un contenitore funzionante con a bordo tutti i compilati, e quindi adatto ad un ambiente di produzione.  
I compilati vengono generati a loro volta usando dei container, quindi non ne resta traccia nella cartella di lavoro e non è necessario avere installati _node_ o _.NET_ sulla macchina locale.

```
.\scripts\run-embed.ps1
```

Questo script lancia localmente i comandi di pubblicazione, poi genera uno stack di nome `playground-embed`, identico a quello generato in modalità _mount_.  
La differenza è che in questo caso i container sono completamente _self-contained_, cioè non dipendono dal file system della macchina ospite per accedere agli eseguibili.

### Modalità _prod_ (_mount_ e _volume_) e deploy

Per lanciare lo stack in ambiente di produzione è necessario esportare tutte le immagini che lo compongono e lanciare un `docker compose` in produzione con le configurazioni `docker-compose.prod.yml`, che anziché costruire le immagini a partire dal repository, lancia uno stack a partire da quelle esportate.

Sulla macchina di sviluppo:

```
.\scripts\export-embed.ps1
```

Sulla macchina di produzione, dopo aver copiato le cartelle `docker` (servono solo `docker-compose.prod.yml` e `playground-site.conf`), `scripts` (serve solo `run-prod.ps1`) e `images`, si possono eseguire tre script:

Questo lancia le immagini _self-contained_ senza costruirle, quindi può essere usato in assenza dei sorgenti e dei _dockerfile_:

```
.\scripts\run-prod.ps1
```

Questo a differenza del precedente _monta_ sulla cartella `data` i file di lavoro (e dunque i db) di _PostgreSQL_:

```
.\scripts\run-prod-mount.ps1
```

Questo invece associa all'immagine `postgres` un _volume_ docker di nome `playground-data`:

```
.\scripts\run-prod-volume.ps1
```

Gli ultimi due script (e relative configurazioni) sono molto utili per rendere realmente _persistenti_ i dati su db, anche se il container del db viene eliminato o ricreato.