import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const PdfScreen = () => {
  const route = useRoute();
  const { name } = route.params;
  const [pdfUrl, setPdfUrl] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (user) {
        try {
          const storageRef = ref(FIREBASE_STORAGE, 'users/' + user.email + '/' + name);
          const url = await getDownloadURL(storageRef);
          setPdfUrl(url);
        } catch (error) {
          console.error('Error fetching PDF URL:', error);
        }
      }
    };

    fetchPdfUrl();
  }, [name, user]); // Add user as a dependency

  return (
    <View style={styles.container}>
      {pdfUrl ? (
        <Pdf
          trustAllCerts={false}
          source={{ uri: pdfUrl, cache: true }}
          onLoadComplete={(numberOfPages, filePath) => {
          }}
          onPageChanged={(page, numberOfPages) => {
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
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
