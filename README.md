# coinTracker-backend

Track your crypto assets in cointracker portfolio!

You can use docker compose to run the whole thing.

1. Run docker-compose up in folder which contains the `docker-compose.yml` file listed below
2. Open localhost:3000 in your browser

Here is the `docker-compose.yml` that powers the whole setup.

```yaml
version: "3.8"
services:
  postgresdb:
    image: postgres
    volumes:
      - data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=1234
  backend:
    image: piotrjozput/cointracker-backend
    ports:
      - '8085:8085'
    environment:
      - POSTGRES_DB_NAME=postgres
      - POSTGRES_DB_USER=postgres
      - POSTGRES_DB_PASSW=1234
      - PORT=8085
      - NODE_ENV=production
    depends_on: 
      - postgresdb
  frontend:
    image: piotrjozput/cointracker-frontend
    ports: 
      - '3000:80'
    depends_on: 
      - backend
volumes:
  data:
```
Backend written in express.js

### Build setup 
```bash

```
