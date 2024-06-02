import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const Forms = () => {
  const navigation = useNavigation();
  const [imageUrls, setImageUrls] = useState({ ficheMultiserv: '', ficheR2C: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const storageRef1 = ref(FIREBASE_STORAGE, 'img/Fiche.jpg');
        const storageRef2 = ref(FIREBASE_STORAGE, 'img/FicheR2C.jpeg');
        const url1 = await getDownloadURL(storageRef1);
        const url2 = await getDownloadURL(storageRef2);
        setImageUrls({ ficheMultiserv: url1, ficheR2C: url2 });
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrls();
  }, []);

  const navigateToForm = () => {
    navigation.navigate('Form'); 
  };

  const navigateToFormR2C = () => {
    navigation.navigate('FormR2C'); 
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formItemContainer}>
        <TouchableOpacity onPress={navigateToForm} style={styles.formItem}>
          <Image 
            source={{ uri: imageUrls.ficheMultiserv }} 
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.itemText}>Intervention Cmultiserv</Text>
      </View>
      <View style={styles.formItemContainer}>
        <TouchableOpacity onPress={navigateToFormR2C} style={styles.formItem}>
          <Image 
            source={{ uri: imageUrls.ficheR2C }} 
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.itemText}>Intervention R2C</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formItemContainer: {
    marginBottom: 30,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
  },
  formItem: {
    width: '100%',
    height: 500,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemText: {
    padding: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Forms;
