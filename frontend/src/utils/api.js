import axios from 'axios';

/**
 * SET API TOKEN FOR HTTP REQUEST
 */

export function setAuthToken (token) {
  axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
}

/**
 * API REQUEST GATEWAY: make all API POST requests
 */

export async function postRequest (apiRoute, data) {
  return await axios.post(apiRoute, data);
}

/**
 * API REQUEST GATEWAY: make all API PUT requests
 */

export async function putRequest (apiRoute, data) {
  return await axios.put(apiRoute, data);
}

/**
 * API REQUEST GATEWAY: make all API GET requests
 */

export async function getRequest (apiRoute, param) {
  return await axios.get(apiRoute, {
    params: param
  });
}