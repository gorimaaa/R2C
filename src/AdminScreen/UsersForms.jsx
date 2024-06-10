import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { Menu, Divider, Provider } from 'react-native-paper';

const fiche = require("../../assets/logo.png");

const UsersForms = () => {
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPdfPreviews = async (loadDisplay) => {
    setLoading(loadDisplay);
    try {
      const usersRef = ref(FIREBASE_STORAGE, 'users/');
      const storageRef1 = ref(FIREBASE_STORAGE, 'img/Fiche.jpg');
      const storageRef2 = ref(FIREBASE_STORAGE, 'img/FicheR2C.jpeg');
      const multiserv_img = await getDownloadURL(storageRef1);
      const r2c_img = await getDownloadURL(storageRef2);
      const userFolders = await listAll(usersRef);

      let allPreviews = [];

      for (const folderRef of userFolders.prefixes) {
        const result = await listAll(folderRef);

        const previews = await Promise.all(result.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);

          let createdAt;
          if (metadata.timeCreated) {
            createdAt = new Date(metadata.timeCreated);
          }

          return {
            multiserv_img,
            r2c_img,
            name: itemRef.name,
            createdAt,
            num: metadata.customMetadata?.num || 'unknown',
            type: metadata.customMetadata?.type || 'unknown'
          };
        }));

        allPreviews = [...allPreviews, ...previews];
      }

      let filteredPreviews = allPreviews.filter(preview => {
        const matchesFilters = filters.length === 0 || filters.includes(preview.type);
        const matchesSearch = searchQuery === '' || preview.num.includes(searchQuery);
        return matchesFilters && matchesSearch;
      });

      filteredPreviews = filteredPreviews.sort((a, b) => {
        if (sortBy === 'recent') {
          return b.createdAt - a.createdAt;
        } else {
          return a.createdAt - b.createdAt;
        }
      });

      if (filteredPreviews.length % 2 !== 0) {
        filteredPreviews.push({ name: 'placeholder', isPlaceholder: true });
      }

      setPdfPreviews(filteredPreviews);
    } catch (error) {
      console.error('Erreur lors de la récupération des URL PDF :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfPreviews(true);
    const interval = setInterval(() => fetchPdfPreviews(false), 30000);
    return () => clearInterval(interval);
  }, [filters, sortBy, searchQuery]);

  const navigation = useNavigation();

  const navigateToForm = (name) => {
    navigation.navigate('AdminPdf', { name });
  };

  const formatDate = (date) => {
    if (!date) {
      return 'Date inconnue';
    }
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return `${date.toLocaleDateString('fr-FR', dateOptions)} à ${date.toLocaleTimeString('fr-FR', timeOptions)}`;
  };

  const handleMenuClose = () => setVisible(false);

  const handleFilter = (type) => {
    if (filters.includes(type)) {
      setFilters(filters.filter(item => item !== type));
    } else {
      setFilters([...filters, type]);
    }
    setVisible(false);
  };

  const handleSortBy = (type) => {
    setSortBy(type);
    setVisible(false);
  };

  const renderItem = ({ item }) => {
    if (item.isPlaceholder) {
      return <View style={[styles.pdfPreviewContainer, styles.placeholderContainer]} />;
    }

    return (
      <TouchableOpacity onPress={() => navigateToForm(item.name)} style={styles.pdfPreviewContainer}>
        <Image
          source={{ uri: (item.type === 'r2c') ? item.r2c_img : item.multiserv_img }}
          style={styles.pdfPreviewImage}
          resizeMode="contain"
        />
        <Text style={styles.pdfPreviewInfo}>{item.num}</Text>
        <Text style={styles.pdfPreviewDate}>Fait le {formatDate(item.createdAt)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par numéro..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Menu
            visible={visible}
            onDismiss={handleMenuClose}
            anchor={<MenuAnchor handlePress={() => setVisible(true)} />}
          >
            <Menu.Item onPress={() => handleFilter('r2c')} title="Fichiers R2C" />
            <Divider />
            <Menu.Item onPress={() => handleFilter('multiserv')} title="Fichiers Multiserv" />
            <Divider />
            <Menu.Item onPress={() => handleSortBy('recent')} title="Plus récents" />
            <Divider />
            <Menu.Item onPress={() => handleSortBy('old')} title="Plus anciens" />
          </Menu>
        </View>

        <View style={styles.selectedFiltersContainer}>
          {filters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.selectedFilter}>
              <Text style={styles.selectedFilterText}>{filter}</Text>
              <TouchableOpacity onPress={() => handleFilter(filter)} style={styles.removeFilterButton}>
                <Text style={styles.removeFilterText}>X</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#045084" />
          </View>
        ) : (
          <FlatList
            data={pdfPreviews}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.pdfListContainer}
            ListEmptyComponent={<Text style={styles.noFilesText}>Aucun fichier trouvé</Text>}
          />
        )}
      </View>
    </Provider>
  );
};

const MenuAnchor = ({ handlePress }) => (
    <TouchableOpacity onPress={handlePress} style={styles.menuAnchor}>
      <Text style={styles.menuText}>Filtrer</Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },
    searchContainer: {
      flex: 1,
    },
    searchInput: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 20,
      paddingLeft: 15,
      backgroundColor: '#f9f9f9',
    },
    selectedFiltersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
      paddingLeft:10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedFilter: {
      flexDirection: 'row',
      backgroundColor: '#4CAF50',
      padding: 5,
      margin: 5,
      alignItems: 'center',
      borderRadius: 20,
    },
    selectedFilterText: {
      color: '#fff',
      marginRight: 5,
    },
    removeFilterButton: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 5,
      marginLeft: 5,
    },
    removeFilterText: {
      color: '#4CAF50',
      fontSize: 12,
    },
    pdfListContainer: {
      padding: 5,
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: 20,
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    pdfPreviewContainer: {
      flex: 1,
      margin: 10,
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 8,
      alignItems: 'center',
      padding: 10,
    },
    placeholderContainer: {
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
      elevation: 0,
    },
    pdfPreviewImage: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    pdfPreviewInfo: {
      marginTop: 5,
      fontSize: 16,
      textAlign: 'center',
      color: '#333',
    },
    pdfPreviewDate: {
      marginTop: 5,
      fontSize: 14,
      textAlign: 'center',
      color: 'grey',
    },
    menuAnchor: {
      flexDirection: 'row',
      padding: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      backgroundColor: '#3498db',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 5,
    },
    noFilesText: {
      fontSize: 18,
      color: 'grey',
      textAlign: 'center',
      marginTop: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default UsersForms;
  
