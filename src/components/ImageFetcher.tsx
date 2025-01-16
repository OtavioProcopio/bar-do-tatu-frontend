import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator, Text } from "react-native";
import ImageService from "../services/ImageService";

const ImageFetcher: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const imageName = "image1.jpg"; // Nome da imagem para busca
        const base64Image = await ImageService.fetchImage(imageName);
        setImageSrc(base64Image);
      } catch (err) {
        setError("Erro ao carregar a imagem.");
      } finally {
        setLoading(false);
      }
    };

    loadImage();
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
      {imageSrc ? (
        <Image source={{ uri: imageSrc }} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>Imagem não encontrada.</Text>
      )}
    </View>
  );
};

export default ImageFetcher;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
