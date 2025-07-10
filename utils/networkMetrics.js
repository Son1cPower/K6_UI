import { Trend } from 'k6/metrics';

export const epDataSent = new Trend('endpoint_data_sent', true);
export const epDataRecv = new Trend('endpoint_data_recv', true);