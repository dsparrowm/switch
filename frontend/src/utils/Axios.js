import axios from 'axios';

const Axios = axios.create({
  headers: {
    authorization : `Bearer ${localStorage.getItem('access_token')}`
  }
});

export default Axios;