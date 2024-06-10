import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Text, Button, Alert } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { ref, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

const AdminPdf = () => {
  const route = useRoute();
  const navigation = useNavigation();
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

  const handleDelete = async () => {
    if (user) {
      try {
        const usersRef = ref(FIREBASE_STORAGE, 'users/');
        const userFolders = await listAll(usersRef);

        for (const folderRef of userFolders.prefixes) {
          const fileRef = ref(FIREBASE_STORAGE, `${folderRef.fullPath}/${name}`);
          try {
            await deleteObject(fileRef);
            Alert.alert('Fichier supprimé avec succès');
            setPdfUrl('');  // Réinitialiser l'URL du PDF
            navigation.goBack(); // Retour après suppression
            break; // Exit loop once the file is found and deleted
          } catch (error) {
            // File not found in this folder, continue to the next
          }
        }
      } catch (error) {
        console.error('Error deleting PDF file:', error);
        Alert.alert('Erreur lors de la suppression du fichier:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {pdfUrl ? (
        <>
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
          <Button title="Supprimer" onPress={handleDelete} />
        </>
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
