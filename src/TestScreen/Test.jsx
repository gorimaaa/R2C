import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Test = () => {
  const [file, setFile] = useState(null);
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
        const source = { uri: response.assets[0].uri, type: response.assets[0].type, name: response.assets[0].fileName };
        setFile(source);
      }
    });
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest()
       xhr.onload = function () {
         // return the blob
         resolve(xhr.response)
       }
       xhr.onerror = function () {
         reject(new Error('uriToBlob failed'))
       }
       xhr.responseType = 'blob'
       xhr.open('GET', uri, true)
   
       xhr.send(null)})}

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(result); // Update to set the entire selected file object
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker Error: ', err);
        Alert.alert('Erreur', `Erreur lors de la sélection du fichier: ${err.message}`);
      }
    }
  };

  const uploadFile = async () => {
    if (!file) {
      Alert.alert('Erreur', 'Veuillez sélectionner un fichier d\'abord');
      return;
    }
    setUploading(true);
    try {
      const filename = file.name;
      const storageRef = ref(FIREBASE_STORAGE, filename);


      //const response = await fetch(file.uri);
      //const blob = await response.blob();
      console.log(file.name)
      blob = await uriToBlob(file.uri)
      
      await uploadBytes(storageRef, blob);





      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      Alert.alert('Succès', 'Fichier téléchargé avec succès !');
      console.log('Téléchargement réussi, URL:', downloadURL);
      setFile(null);
    } catch (e) {
      console.log('Erreur lors du téléchargement du fichier: ', e);
      Alert.alert('Erreur', `Une erreur est survenue lors du téléchargement du fichier: ${e.message}`);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.btnText}>Choisir une image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.selectButton} onPress={pickFile}>
        <Text style={styles.btnText}>Choisir un fichier</Text>
      </TouchableOpacity>
      <View style={styles.fileContainer}>
        {file && (
          <Text style={{ margin: 20 }}>{file.name}</Text>
        )}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: file ? '#3F51B5' : '#9E9E9E' }]}
          onPress={uploadFile}
        >
          <Text style={styles.btnText}>{uploading ? 'Téléchargement en cours...' : 'Télécharger le fichier'}</Text>
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
  fileContainer: {
    alignItems: 'center',
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
