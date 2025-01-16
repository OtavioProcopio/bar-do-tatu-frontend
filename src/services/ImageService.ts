import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageService = {
  fetchImage: async (imageName: string): Promise<string> => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    try {
      const response = await axios.get(`http://localhost:8080/api/images/${imageName}`, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
      return base64Image;
    } catch (error) {
      console.error('Erro ao buscar a imagem:', error);
      throw error;
    }
  },
};

export default ImageService;
