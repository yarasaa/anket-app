/* eslint-disable import/newline-after-import */
/* eslint-disable prettier/prettier */
import axios from 'axios';
const BASE_URL = 'https://localhost:7038/';

const instance = axios.create({
  baseURL: BASE_URL,

  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf8',
  },
  // withCredentials:true,
  // method:'GET',
});

export default instance;
