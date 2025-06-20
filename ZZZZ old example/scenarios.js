import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import {Counter, Trend} from "k6/metrics"; // Importing metrics for potential future use



let myCounter = new Counter('my_counter'); // Example of a custom counter metric
let newPageResponseTrend = new Trend('new_page_response_time'); // Example of a custom trend metric


export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'], // less than 1% of requests should fail
        http_reqs: ['count > 50'], // at least 100 requests should be made
        my_counter: ['count > 10'], // Custom threshold for the custom counter metric
    },
}



export default function () {
        let res = http.get('https://test.k6.io');
        myCounter.add(1); // Increment the custom counter metric
      // console.log( res);
      //  console.log(res.body)
      check(res, {
        'is status 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,   
         'page is startpage': (r) => r.body.includes('QuickPizza'),
              })
    sleep(1); // simulate user think time


    res = http.get('https://quickpizza.grafana.com/login');
newPageResponseTrend.add(res.timings.duration); // Record the response time for the new page
sleep(1);
    }