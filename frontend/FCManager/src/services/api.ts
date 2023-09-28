import axios, {AxiosInstance} from 'axios';

const apiJson: AxiosInstance = axios.create({
  baseURL: 'https://fcmanager-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiFormdata: AxiosInstance = axios.create({
  baseURL: 'https://fcmanager-backend.onrender.com',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export {apiJson, apiFormdata};
