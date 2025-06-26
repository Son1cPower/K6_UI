import http from 'k6/http';
import { check } from 'k6';

// Shared default headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

function mergeParams(all = {}) {
  const {
    query,
    headers = {},
    timeout = DEFAULT_TIMEOUT,
    ...rest
  } = all;

  return {
    ...rest,
    timeout,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers
    },
    params: query ? { query } : undefined
  };
}

function processResponse(response, {
  validateStatus = true,
  checkBodyLength = true,
  name = 'HTTP Request',
  tags = {}
} = {}) {
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

function prepareBody(body, all = {}) {
  if (typeof body === 'string') return body;
  if (all.headers && all.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    return body;
  }
  return JSON.stringify(body);
}

function extractMeta(all = {}, method, url) {
  return {
    name: all.name || `${method.toUpperCase()} ${url}`,
    tags: all.tags || {}
  };
}

export function get(url, all = {}) {
  const { name, tags } = extractMeta(all, 'GET', url);
  const mergedParams = { ...mergeParams(all), tags };

  return processResponse(
    http.get(url, mergedParams),
    { ...all, name, tags }
  );
}

export function post(url, body, all = {}) {
  const { name, tags } = extractMeta(all, 'POST', url);
  const mergedParams = { ...mergeParams(all), tags };

  return processResponse(
    http.post(url, prepareBody(body, all), mergedParams),
    { ...all, name, tags }
  );
}

export function put(url, body, all = {}) {
  const { name, tags } = extractMeta(all, 'PUT', url);
  const mergedParams = { ...mergeParams(all), tags };

  return processResponse(
    http.put(url, prepareBody(body, all), mergedParams),
    { ...all, name, tags }
  );
}

export function del(url, all = {}) {
  const { name, tags } = extractMeta(all, 'DELETE', url);
  const mergedParams = { ...mergeParams(all), tags };

  return processResponse(
    http.del(url, mergedParams),
    { ...all, name, tags }
  );
}

export function patch(url, body, all = {}) {
  const { name, tags } = extractMeta(all, 'PATCH', url);
  const mergedParams = { ...mergeParams(all), tags };

  return processResponse(
    http.patch(url, prepareBody(body, all), mergedParams),
    { ...all, name, tags }
  );
}

export function batch(requests = []) {
  const responses = {};
  requests.forEach(req => {
    const { method, url, body, params } = req;
    const key = req.tag || url;

    switch (method.toLowerCase()) {
      case 'get':
        responses[key] = get(url, params);
        break;
      case 'post':
        responses[key] = post(url, body, params);
        break;
      case 'put':
        responses[key] = put(url, body, params);
        break;
      case 'del':
      case 'delete':
        responses[key] = del(url, params);
        break;
      case 'patch':
        responses[key] = patch(url, body, params);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  });
  return responses;
}
