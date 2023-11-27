import {Usuario as UsuarioType, UsuarioItem, ErrorType} from '../types';
import api from './api';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Keychain from 'react-native-keychain';

interface UsuarioListReturn {
  values: UsuarioItem[];
  metadata: {
    itens: number;
  };
}

interface NewUsuarioForm {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  matricula: string;
  cpf: string;
  isAdmin: boolean;
}

interface UpdateUsuarioForm {
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  foto?: string;
  isAdmin?: boolean;
}

class Usuario {
  async getAll(): Promise<UsuarioListReturn> {
    const {data} = await api.apiJson.get('/usuarios');
    return data;
  }

  async getById(id: string): Promise<UsuarioType> {
    const {data} = await api.apiJson.get(`/usuarios/${id}`);
    return data;
  }

  async new(usuario: NewUsuarioForm): Promise<{id: string} | ErrorType> {
    try {
      const {data} = await api.apiJson.post('/usuarios', usuario);
      return data;
    } catch (error: any) {
      if (error.response) {
        // A resposta contém informações de erro
        return {
          errorNum: error.response.status,
          errorMsg: error.response.data.error,
        };
      } else {
        // Erro de rede ou algo de errado na solicitação
        throw error; // Rejeite o erro para que o código que chama essa função possa tratá-lo
      }
    }
  }

  async update(
    usuario: UpdateUsuarioForm,
    id: string,
  ): Promise<{id: string} | ErrorType> {
    const formData = new FormData();
    usuario.nome && formData.append('nome', usuario.nome);
    usuario.email && formData.append('email', usuario.email);
    usuario.sobrenome && formData.append('sobrenome', usuario.sobrenome);
    usuario.telefone && formData.append('telefone', usuario.telefone);
    formData.append('isAdmin', usuario.isAdmin ? 'true' : 'false');

    if (usuario.foto) {
      const imgName = 'foto.jpg';
      formData.append('foto', {
        uri: usuario.foto,
        name: imgName,
        type: 'image/jpeg',
      });
    }

    try {
      const {data} = await api.apiFormdata.put(`/usuarios/${id}`, formData);
      return data;
    } catch (error: any) {
      // Trate o erro e retorne o JSON de erro
      if (error.response) {
        // A resposta contém informações de erro
        return {
          errorNum: error.response.status,
          errorMsg: error.response.data.error,
        };
      } else {
        // Erro de rede ou algo de errado na solicitação
        throw error; // Rejeite o erro para que o código que chama essa função possa tratá-lo
      }
    }
  }

  async updatePassowrd(
    senhaAntiga: string,
    senhaNova: string,
  ): Promise<any | ErrorType> {
    try {
      const retorno = await api.apiJson.put('usuarios/login/senha', {
        senhaAntiga,
        senhaNova,
      });
      return retorno;
    } catch (error: any) {
      if (error.response) {
        return {
          errorNum: error.response.status,
          errorMsg: error.response.data.error,
        };
      } else {
        throw error;
      }
    }
  }

  async loginEmail(
    email: string,
  ): Promise<{nome: string; sobrenome: string} | ErrorType> {
    try {
      const {data} = await api.apiJson.post('usuarios/login/email', {email});
      return data;
    } catch (error: any) {
      // Trate o erro e retorne o JSON de erro
      if (error.response) {
        // A resposta contém informações de erro
        return {
          errorNum: error.response.status,
          errorMsg: error.response.data.error,
        };
      } else {
        // Erro de rede ou algo de errado na solicitação
        throw error; // Rejeite o erro para que o código que chama essa função possa tratá-lo
      }
    }
  }

  async login(email: string, senha: string): Promise<UsuarioType | ErrorType> {
    try {
      const {data} = await api.apiJson.post('usuarios/login', {
        email,
        senha,
      });

      api.setToken(data.token);

      await Keychain.setGenericPassword(email, senha);

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(data.user));

      return data.user;
    } catch (error: any) {
      // Trate o erro e retorne o JSON de erro
      if (error.response) {
        // A resposta contém informações de erro
        return {
          errorNum: error.response.status,
          errorMsg: error.response.data.error,
        };
      } else {
        // Erro de rede ou algo de errado na solicitação
        throw error; // Rejeite o erro para que o código que chama essa função possa tratá-lo
      }
    }
  }

  async exit() {
    api.setToken(null);

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
  }

  async sendCode() {
    console.log('mandando código');
  }

  async forgotPassword(code: string, password?: string) {
    console.log('código ', code);
    console.log('senha ', password);

    return true;
  }
}

export default new Usuario();
