import React, { useEffect } from 'react';
import axios from 'axios';
import { serverConnectionStatus } from '../utils/APIRoutes';

function Home () {
  const getServerConnectionStatus = async () => {
    try {
      const { data } = await axios.get(serverConnectionStatus);
      console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect( () => {
    getServerConnectionStatus();
  }, []);

  return (
    <div>Home</div>
  );
}

export default Home;
