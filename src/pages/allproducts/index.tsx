import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axiosConfig from '../../api/axiosConfig';
import ImageService from '../../services/ImageService';
import { ProdutoDTO } from '../../types';

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<ProdutoDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<ProdutoDTO>({
    nome: '',
    descricao: '',
    categoria: '',
    quantidadeEstoque: 0,
    precoDeCusto: 0,
    precoDeVenda: 0,
    caminhoImagem: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await axiosConfig.listarProdutos();
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await axiosConfig.buscarPorNomeOuCategoria(searchQuery);
      setProducts(data);
    } catch (err) {
      setError('Erro ao buscar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await axiosConfig.deletarProduto(id);
      Alert.alert('Sucesso', 'Produto excluído com sucesso.');
      fetchProducts();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao excluir produto.');
    }
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrigido para MediaTypeOptions.Images
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets?.[0]?.uri || null); // Ajustado para acessar result.assets
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    const formData = new FormData();
    const filename = selectedImage.split('/').pop();
    const type = `image/${filename?.split('.').pop()}`;

    formData.append('imagem', {
      uri: selectedImage,
      name: filename,
      type,
    } as any);

    try {
      const response = await axiosConfig.uploadImage(formData);
      return response.caminhoImagem; // Ajustado para acessar diretamente response.caminhoImagem
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      Alert.alert('Erro', 'Não foi possível fazer upload da imagem.');
      return null;
    }
  };

  const createProduct = async () => {
    try {
      let imagePath = '';

      if (selectedImage) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          imagePath = uploadedPath;
        }
      }

      const updatedProduct = { ...newProduct, caminhoImagem: imagePath };
      await axiosConfig.criarProduto(updatedProduct);

      Alert.alert('Sucesso', 'Produto criado com sucesso.');
      setModalVisible(false);
      fetchProducts();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao criar produto.');
    }
  };

  const renderProduct = ({ item }: { item: ProdutoDTO }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `${ImageService.fetchImage(item.caminhoImagem || '')}` }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardDescription}>{item.descricao}</Text>
        <Text style={styles.cardCategory}>{item.categoria}</Text>
        <Text style={styles.cardStock}>Estoque: {item.quantidadeEstoque}</Text>
        <Text style={styles.cardPrice}>R$ {item.precoDeVenda.toFixed(2)}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Editar', 'Funcionalidade não implementada')}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteProduct(item.id!)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar produtos"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Buscar" onPress={searchProducts} />
      <Button title="Adicionar Produto" onPress={() => setModalVisible(true)} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newProduct.nome}
              onChangeText={(text) => setNewProduct({ ...newProduct, nome: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newProduct.descricao}
              onChangeText={(text) => setNewProduct({ ...newProduct, descricao: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Categoria"
              value={newProduct.categoria}
              onChangeText={(text) => setNewProduct({ ...newProduct, categoria: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade em Estoque"
              keyboardType="numeric"
              value={newProduct.quantidadeEstoque.toString()}
              onChangeText={(text) => setNewProduct({ ...newProduct, quantidadeEstoque: parseInt(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço de Custo"
              keyboardType="numeric"
              value={newProduct.precoDeCusto.toString()}
              onChangeText={(text) => setNewProduct({ ...newProduct, precoDeCusto: parseFloat(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço de Venda"
              keyboardType="numeric"
              value={newProduct.precoDeVenda.toString()}
              onChangeText={(text) => setNewProduct({ ...newProduct, precoDeVenda: parseFloat(text) })}
            />
            <Button title="Selecionar Imagem" onPress={selectImage} />
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}
            <View style={styles.modalActions}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={createProduct} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardCategory: {
    fontSize: 14,
    color: '#999',
  },
  cardStock: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductsScreen;
