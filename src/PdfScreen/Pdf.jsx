import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const PdfScreen = () => {
  const route = useRoute();
  const { name } = route.params;
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const storageRef = ref(FIREBASE_STORAGE,"pdf/" + name);
        const url = await getDownloadURL(storageRef);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    };

    fetchPdfUrl();
  }, [name]);

  return (
    <View style={styles.container}>
      {pdfUrl ? (
        <Pdf
          trustAllCerts={false}
          source={{ uri: pdfUrl, cache: true }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      ) : (
        <Text>Loading PDF...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfScreen;