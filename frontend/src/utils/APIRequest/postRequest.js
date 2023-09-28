import Axios from '../Axios';

/**
 * API REQUEST GATEWAY: make all API get requests
 */

export default async function postRequests (apiRoute, data) {
  try {
    return await Axios.post(apiRoute, data);
  } catch (error) {
    console.log(error);
  }
}
