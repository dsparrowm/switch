import Axios from '../Axios';

/**
 * API REQUEST GATEWAY: make all API get requests
 */

export default async function getRequests (apiRoute, param) {
  try {
    return await Axios.get(apiRoute, {
      params: param
    });
  } catch (error) {
    console.log(error);
  }
}
