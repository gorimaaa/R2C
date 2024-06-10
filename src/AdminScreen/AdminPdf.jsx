import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

const AdminPdf = () => {
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
          const usersRef = ref(FIREBASE_STORAGE, 'users/');
          const userFolders = await listAll(usersRef);

          for (const folderRef of userFolders.prefixes) {
            const fileRef = ref(FIREBASE_STORAGE, `${folderRef.fullPath}/${name}`);
            try {
              const url = await getDownloadURL(fileRef);
              setPdfUrl(url);
              break; // Exit loop once the file is found
            } catch (error) {
              // File not found in this folder, continue to the next
            }
          }
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

export default AdminPdf;