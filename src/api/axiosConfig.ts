import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProdutoDTO } from '../types';

const baseURL = 'http://localhost:8080/produtos';

const axiosConfig = {
  criarProduto: async (produtoDTO: ProdutoDTO): Promise<ProdutoDTO> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await axios.post(`${baseURL}/save`, produtoDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  uploadImage: async (formData: FormData): Promise<{ caminhoImagem: string }> => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticação não encontrado.');
  
    try {
      const response = await axios.post(`${baseURL}/uploadImage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  },
  

  listarProdutos: async (): Promise<ProdutoDTO[]> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await axios.get(`${baseURL}/listAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  buscarPorNomeOuCategoria: async (nome?: string, categoria?: string): Promise<ProdutoDTO[]> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await axios.get(`${baseURL}/findByNameOrCategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          nome: nome || undefined,
          categoria: categoria || undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos por nome ou categoria:', error);
      throw error;
    }
  },

  buscarProdutoPorId: async (id: number): Promise<ProdutoDTO> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await axios.get(`${baseURL}/findById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  },

  atualizarProduto: async (id: number, produtoDTO: ProdutoDTO): Promise<ProdutoDTO> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      const response = await axios.put(`${baseURL}/atualizar/${id}`, produtoDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  deletarProduto: async (id: number): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      await axios.delete(`${baseURL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },
};

export default axiosConfig;
