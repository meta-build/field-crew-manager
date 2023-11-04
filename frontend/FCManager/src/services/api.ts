import axios, {AxiosInstance} from 'axios';

class Api {
  private url: string = 'https://fcmanager-backend.onrender.com/';

  public apiJson: AxiosInstance = axios.create({
    baseURL: this.url,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  public apiFormdata: AxiosInstance = axios.create({
    baseURL: this.url,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  public setToken(token: string | null): void {
    // Configura o token nas instâncias Axios
    this.apiJson.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : null;
    this.apiFormdata.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : null;
  }
}

export default new Api();
