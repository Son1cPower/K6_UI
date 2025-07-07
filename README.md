docker 

- docker compose build
- docker compose up -d
- docker compose run --rm -T k6 run tests/web/scenarios/MR_Login.js --env ENVIRONMENT=bugfest