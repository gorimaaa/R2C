import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, StyleSheet } from 'react-native';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const MyForms = () => {
  const [pdfPreviews, setPdfPreviews] = useState([]);

  useEffect(() => {
    async function fetchPdfPreviews() {
      try {
        filename = 'thereactnativebook-sample.pdf'
        const storageRef = ref(FIREBASE_STORAGE, filename);
        const downloadURL = await getDownloadURL(storageRef);        
        // Mettez à jour l'état avec les URLs obtenues
        setPdfPreviews([downloadURL]);
        console.log(pdfPreviews)
      } catch (error) {
        console.error('Error fetching PDF URLs: ', error);
      }
    }

    fetchPdfPreviews();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pdfPreviews.map((url, index) => (
        <View key={index} style={styles.pdfPreviewContainer}>
          <Image
            source={{ uri: `http://example.com/api/pdfThumbnail?url=${encodeURIComponent(url)}&page=1&width=200` }}
            style={styles.pdfPreviewImage}
            resizeMode="contain"
          />
          {/* Ajoutez d'autres informations ou des actions liées au PDF */}
          <Text style={styles.pdfPreviewInfo}>PDF {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pdfPreviewContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  pdfPreviewImage: {
    width: 200,
    height: 200,
  },
  pdfPreviewInfo: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default MyForms;
