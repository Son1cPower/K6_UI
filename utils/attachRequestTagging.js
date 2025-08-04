import { Trend } from 'k6/metrics';
import { __CURRENT_UI_GROUP__ } from './groupUI.js';
const BASE_URL = 'https://awsdripp.drimotors.com';

const uiRequestDuration = new Trend('ui_request_duration', true);

const requestTimings = new Map(); 

export function attachRequestTagging(page) {
  page.on('request', req => {
    const url = req.url();
    requestTimings.set(url, Date.now()); 
  });


 page.on('response', async res => {
    try {
      const req = res.request();
      const method = req.method();
      const url = req.url();


      if (!url.startsWith(BASE_URL)) return;

      const path = url.replace(BASE_URL, '').split('?')[0];

      const startTime = requestTimings.get(url);
      const group = __CURRENT_UI_GROUP__ || 'ungrouped';
      const label = `${group} - ${method} ${path}`; 

      if (startTime) {
        const duration = Date.now() - startTime;
        uiRequestDuration.add(duration, { name: label });
        requestTimings.delete(url);
      }

      // console.log(`📡 ${label} — ${res.status()} (${res.statusText()})`);
    } catch (e) {
      console.warn(`⚠️ Error handling response: ${e}`);
    }
  });

}
