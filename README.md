docker 

- docker compose build
- docker compose up -d
- docker compose run --rm -T k6 run tests/web/scenarios/MR_Login.js --env ENVIRONMENT=bugfest

  docker compose run --rm -T k6 run -e WORKLOAD=smoke -e ENVIRONMENT=bugfest tests/web/flows/MR_flow_2.js

npm run k6:test:mediated

docker compose run --rm -T k6 run -e WORKLOAD=smoke -e ENVIRONMENT=relc tests/web/flows/MR_flow_2.js  

- docker compose down