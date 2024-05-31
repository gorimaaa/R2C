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
        // Référence à l'emplacement de stockage où les PDFs sont stockés
        const storageRef = ref(FIREBASE_STORAGE, '/');
        
        // Liste de tous les éléments (fichiers) dans le répertoire
        const result = await listAll(storageRef);
        
        const previews = await Promise.all(result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          
          // Téléchargez le PDF localement
          const localPath = `${RNFS.DocumentDirectoryPath}/${itemRef.name}`;
          await RNFS.downloadFile({ fromUrl: downloadURL, toFile: localPath }).promise;
          
          // Générer une vignette pour le PDF
          const page = 0;
          const { uri } = await PdfThumbnail.generate(localPath, page);

          console.log(uri); // Debugging: Log URI to ensure it is correct
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
    width: Dimensions.get('window').width * 0.8, // Ensure the container takes appropriate width
  },
  touchable: {
    width: '100%', // Ensure the touchable area is full width
  },
  pdfPreviewImage: {
    width: '100%', // Set width to 100% of the container
    height: 300, // Set a fixed height for all images
  },
  pdfPreviewInfo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MyForms;
