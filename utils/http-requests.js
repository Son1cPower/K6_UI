  // { method: 'post', url: '...', body: {...}, params: {}, options: {} }

import http from 'k6/http';
import { check } from 'k6';

// Shared default headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

function mergeParams(params = {}) {
  return {
    timeout: DEFAULT_TIMEOUT,
    ...params,
    headers: {
      ...DEFAULT_HEADERS,
      ...params.headers
    },
    params: params.query ? { query: params.query } : undefined
  };
}

function processResponse(response, options = {}) {
  const {
    validateStatus = true,
    checkBodyLength = true,
    name = 'HTTP Request',
    tags = {}
  } = options;

  if (validateStatus) {
    check(response, {
      [`${name} status is 2xx`]: (r) => r.status >= 200 && r.status < 300,
    }, tags);
  }

  if (checkBodyLength) {
    check(response, {
      [`${name} has body`]: (r) => r.body && r.body.length > 0,
    }, tags);
  }

  return response;
}

function prepareBody(body, params = {}) {
  if (typeof body === 'string') return body;
  if (params.headers && params.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    return body;
  }
  return JSON.stringify(body);
}

export function get(url, params = {}, options = {}) {
  const tags = options.tags || params.tags || {};
  const name = options.name || params.name || `GET ${url}`;
  const mergedParams = { ...mergeParams(params), tags };

  return processResponse(
    http.get(url, mergedParams),
    { ...options, name, tags }
  );
}

export function post(url, body, params = {}, options = {}) {
  const tags = options.tags || params.tags || {};
  const name = options.name || params.name || `POST ${url}`;
  const mergedParams = { ...mergeParams(params), tags };

  return processResponse(
    http.post(url, prepareBody(body, params), mergedParams),
    { ...options, name, tags }
  );
}

export function put(url, body, params = {}, options = {}) {
  const tags = options.tags || params.tags || {};
  const name = options.name || params.name || `PUT ${url}`;
  const mergedParams = { ...mergeParams(params), tags };

  return processResponse(
    http.put(url, prepareBody(body, params), mergedParams),
    { ...options, name, tags }
  );
}

export function del(url, params = {}, options = {}) {
  const tags = options.tags || params.tags || {};
  const name = options.name || params.name || `DELETE ${url}`;
  const mergedParams = { ...mergeParams(params), tags };

  return processResponse(
    http.del(url, mergedParams),
    { ...options, name, tags }
  );
}

export function patch(url, body, params = {}, options = {}) {
  const tags = options.tags || params.tags || {};
  const name = options.name || params.name || `PATCH ${url}`;
  const mergedParams = { ...mergeParams(params), tags };

  return processResponse(
    http.patch(url, prepareBody(body, params), mergedParams),
    { ...options, name, tags }
  );
}

export function batch(requests = []) {
  const responses = {};
  requests.forEach(req => {
    const { method, url, body, params, options } = req;
    switch (method.toLowerCase()) {
      case 'get':
        responses[req.tag || url] = get(url, params, options);
        break;
      case 'post':
        responses[req.tag || url] = post(url, body, params, options);
        break;
      case 'put':
        responses[req.tag || url] = put(url, body, params, options);
        break;
      case 'del':
      case 'delete':
        responses[req.tag || url] = del(url, params, options);
        break;
      case 'patch':
        responses[req.tag || url] = patch(url, body, params, options);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  });
  return responses;
}



// batch example
// const headers = getAuthHeaders(token);
// const responses = batch([
//   { method: 'get', url: url1, params: { headers }, options: { name: 'First' }},
//   { method: 'post', url: url2, body: {...}, params: { headers }, options: { name: 'Second' }}