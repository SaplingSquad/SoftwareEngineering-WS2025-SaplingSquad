# Starten
Im `database` Ordner
```shell
docker compose -f ./compose.yml -p database up -d
```

# Stoppen
Im `database` Ordner
```shell
docker compose -f ./compose.yml -p database down
```

# Neues Schema
Zuerst Stoppen:
```shell
docker compose -f ./compose.yml -p database down
```
dann Volume löschen (**Löscht alle inhalte der DB!!!**)
```shell
docker volume rm sapsquad-postgres-data
```
