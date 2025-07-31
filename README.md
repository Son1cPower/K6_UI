FRONTEND

 $env:K6_BROWSER_HEADLESS="false"; k6 run tests/e2e/searchFlow.js
 docker compose up -d
 docker compose run --rm k6 run tests/e2e/searchFlow.js        
 k6 cloud tests/e2e/searchFlow.js              