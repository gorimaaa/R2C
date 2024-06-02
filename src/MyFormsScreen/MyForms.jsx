import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import PdfThumbnail from 'react-native-pdf-thumbnail';

const MyForms = () => {
  const [pdfPreviews, setPdfPreviews] = useState([]);

  useEffect(() => {
    async function fetchPdfPreviews() {
      try {
        const storageRef = ref(FIREBASE_STORAGE, 'pdf/');
        const result = await listAll(storageRef);

        const previews = await Promise.all(result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          console.log(`Downloading: ${downloadURL}`);

          const localPath = `${RNFS.DocumentDirectoryPath}/${itemRef.name}`;
          await RNFS.downloadFile({ fromUrl: downloadURL, toFile: localPath }).promise;
          console.log(`Downloaded to: ${localPath}`);

          // Vérifiez si le fichier existe
          const fileExists = await RNFS.exists(localPath);
          console.log(`File exists: ${fileExists}`);

          if (!fileExists) {
            throw new Error(`File not found at path: ${localPath}`);
          }

          // Ajouter un délai pour s'assurer que le fichier est entièrement écrit
          await new Promise(resolve => setTimeout(resolve, 1000));

          const page = 0;
          const { uri } = await PdfThumbnail.generate(localPath, page);
          console.log(`Generated thumbnail: ${uri}`);

          return { uri, name: itemRef.name };
        }));

        setPdfPreviews(previews);
      } catch (error) {
        console.error('Error fetching PDF URLs: ', error);
      }
    }

    fetchPdfPreviews();
  }, []);

  const navigation = useNavigation();

  const navigateToForm = (name) => {
    navigation.navigate('Pdf', { name }); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pdfPreviews.map((preview, index) => (
        <View key={index} style={styles.pdfPreviewContainer}>
          <TouchableOpacity onPress={() => navigateToForm(preview.name)} style={styles.touchable}>
            <Image
              source={{ uri: preview.uri }}
              style={styles.pdfPreviewImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.pdfPreviewInfo}>{preview.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  pdfPreviewContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
  },
  touchable: {
    width: '100%',
  },
  pdfPreviewImage: {
    width: '100%',
    height: 300,
  },
  pdfPreviewInfo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MyForms;
