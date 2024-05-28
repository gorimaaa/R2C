import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importation des fonctions nécessaires

const Test = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Erreur', `Erreur lors de la sélection de l'image: ${response.errorMessage}`);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Erreur', 'Veuillez sélectionner une image d\'abord');
      return;
    }
    setUploading(true);
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
      const storageRef = ref(FIREBASE_STORAGE, filename); // Créer une référence de stockage
      await uploadBytes(storageRef, blob); // Télécharger le fichier
      const downloadURL = await getDownloadURL(storageRef); // Obtenir l'URL de téléchargement
      setUploading(false);
      Alert.alert('Succès', 'Photo téléchargée avec succès !');
      console.log('Téléchargement réussi, URL:', downloadURL); // Affiche l'URL de téléchargement
      setImage(null);
    } catch (e) {
      console.log('Erreur lors du téléchargement de l\'image: ', e);
      Alert.alert('Erreur', `Une erreur est survenue lors du téléchargement de l'image: ${e.message}`);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.btnText}>Choisir une image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && (
          <Image source={{ uri: image.uri }} style={{ width: 300, height: 300 }} />
        )}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: image ? '#3F51B5' : '#9E9E9E' }]}
          onPress={uploadImage}
          disabled={!image || uploading}
        >
          <Text style={styles.btnText}>{uploading ? 'Téléchargement en cours...' : 'Télécharger l\'image'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  selectButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#3F51B5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});

export default Test;
