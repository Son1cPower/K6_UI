import http from 'k6/http';
import { check } from 'k6';
import { epDataSent, epDataRecv } from './networkMetrics.js';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
const DEFAULT_TIMEOUT = 30000;

function mergeParams(all = {}, method = 'GET', url = '') {
  const {
    query = {},
    headers = {},
    timeout = DEFAULT_TIMEOUT,
    tags = {},
    name: explicitName,
    checkBodyLength = true,
    validateStatus = true,
    ...rest
  } = all;

  const match = url.match(/^https?:\/\/[^/]+(\/[^?#]*)?/);
  const path = (match && match[1]) || url;
  const finalName = explicitName || tags.name || `${method.toUpperCase()} ${path}`;
  const finalTags = { ...tags, name: finalName };

  return {
    ...rest,
    timeout,
    headers: { ...DEFAULT_HEADERS, ...headers },
    query,
    tags: finalTags,
    name: finalName,
    checkBodyLength,
    validateStatus,
  };
}

function processResponse(res, { name, tags, checkBodyLength, validateStatus }) {
  if (validateStatus) {
    check(res, { [`${name} status is 2xx`]: r => r.status >= 200 && r.status < 300 }, tags);
  }
  if (checkBodyLength) {
    check(res, { [`${name} has body`]: r => r.body && r.body.length > 0 }, tags);
  }
  return res;
}

function trackData(res, tags) {
  const hdrSize = h => Object.entries(h || {})
    .reduce((sum, [k, v]) => sum + k.length + String(v).length, 0);
  const commonTags = {
    ...tags,
    url: res.url,
  };
  epDataSent.add(hdrSize(res.request.headers) + (res.request.body?.length || 0), commonTags);
  epDataRecv.add(hdrSize(res.headers) + (res.body?.length || 0), commonTags);
}

// === HTTP METHODS ===

export function get(url, all = {}) {
  const p = mergeParams(all, 'GET', url);
  const res = http.get(url, {
    headers: p.headers,
    timeout: p.timeout,
    tags: p.tags,
    query: p.query,
  });
  trackData(res, p.tags);
  return processResponse(res, p);
}

export function post(url, body, all = {}) {
  const p = mergeParams(all, 'POST', url);
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const res = http.post(url, payload, {
    headers: p.headers,
    timeout: p.timeout,
    tags: p.tags,
    query: p.query,
  });
  trackData(res, p.tags);
  return processResponse(res, p);
}

export function put(url, body, all = {}) {
  const p = mergeParams(all, 'PUT', url);
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const res = http.put(url, payload, {
    headers: p.headers,
    timeout: p.timeout,
    tags: p.tags,
    query: p.query,
  });
  trackData(res, p.tags);
  return processResponse(res, p);
}

export function del(url, all = {}) {
  const p = mergeParams(all, 'DELETE', url);
  const res = http.del(url, null, {
    headers: p.headers,
    timeout: p.timeout,
    tags: p.tags,
    query: p.query,
  });
  trackData(res, p.tags);
  return processResponse(res, p);
}

export function patch(url, body, all = {}) {
  const p = mergeParams(all, 'PATCH', url);
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const res = http.patch(url, payload, {
    headers: p.headers,
    timeout: p.timeout,
    tags: p.tags,
    query: p.query,
  });
  trackData(res, p.tags);
  return processResponse(res, p);
}

export function batch(requests = []) {
  const out = {};
  for (const req of requests) {
    const { method, url, body, params } = req;
    switch (method.toLowerCase()) {
      case 'get':    out[url] = get(url, params);    break;
      case 'post':   out[url] = post(url, body, params);   break;
      case 'put':    out[url] = put(url, body, params);    break;
      case 'delete':
      case 'del':    out[url] = del(url, params);    break;
      case 'patch':  out[url] = patch(url, body, params);  break;
      default: throw new Error(`Unsupported method: ${method}`);
    }
  }
  return out;
}
