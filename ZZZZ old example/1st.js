import http from "k6/http";
import { sleep } from 'k6';
// import { check } from 'k6';
// import { group } from 'k6';
// import { Rate } from 'k6/metrics';

const options = {
  vus: 1, // Number of virtual users  
  // duration: '10s', // Duration of the test
  // thresholds: {
  //   http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  // },
};
export { options };



export default function () {
  const url = 'https://test.k6.io/'
  const params = {
    headers: {
      'User-Agent': 'k6-test',
    },
    
  }   

  const res = http.get(url, params)
 sleep(1);
  http.get('https://test.k6.io');
    sleep(1);
    http.get('https://test.k6.io/contact.php');
    sleep(2);
    http.get('https://test.k6.io/news.php');
    sleep(2);
  // Check if the response status is 200
  // check(res, {
  // console.log(`Response time: ${res.timings.duration} ms`)
  //  console.log(`VU ${__VU}, Iteration ${__ITER}, URL: ${url}`);
}








