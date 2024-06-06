import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { Menu, Divider, Provider } from 'react-native-paper';

const fiche = require("../../assets/logo.png");

const MyForms = () => {
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [filters, setFilters] = useState([]); // State pour les filtres sélectionnés
  const [sortBy, setSortBy] = useState('recent'); // State pour le type de tri : 'recent' ou 'old'
  const [visible, setVisible] = useState(false); // State pour la visibilité du menu déroulant
  const [user, setUser] = useState(null);

  const fetchPdfPreviews = async (user) => {
    try {
      const storageRef = ref(FIREBASE_STORAGE, 'users/' + user.email + '/');
      const storageRef1 = ref(FIREBASE_STORAGE, 'img/Fiche.jpg');
      const storageRef2 = ref(FIREBASE_STORAGE, 'img/FicheR2C.jpeg');
      const multiserv_img = await getDownloadURL(storageRef1);
      const r2c_img = await getDownloadURL(storageRef2);
      const result = await listAll(storageRef);

      const previews = await Promise.all(result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);

        let createdAt;
        if (metadata.timeCreated) {
          createdAt = new Date(metadata.timeCreated);
        }

        return { multiserv_img, r2c_img, name: itemRef.name, createdAt, type: metadata.customMetadata?.type || 'unknown', };
      }));

      // Filtrer les prévisualisations en fonction des filtres sélectionnés
      let filteredPreviews = previews.filter(preview => {
        if (filters.length === 0 || filters.includes(preview.type)) {
          return true;
        }
        return false;
      });

      // Tri des prévisualisations par date de création
      filteredPreviews = filteredPreviews.sort((a, b) => {
        if (sortBy === 'recent') {
          return b.createdAt - a.createdAt; // Plus récent en premier
        } else {
          return a.createdAt - b.createdAt; // Plus ancien en premier
        }
      });

      // Ajouter un élément factice si le nombre est impair
      if (filteredPreviews.length % 2 !== 0) {
        filteredPreviews.push({ name: 'placeholder', isPlaceholder: true });
      }

      setPdfPreviews(filteredPreviews);
    } catch (error) {
      console.error('Erreur lors de la récupération des URL PDF :', error);
    }
  };

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
    if (user) {
      fetchPdfPreviews(user);

      // Vérifier périodiquement toutes les 5 secondes (5000 ms)
      const interval = setInterval(() => fetchPdfPreviews(user), 5000); // 5 secondes

      // Nettoyer l'intervalle lors du démontage du composant
      return () => clearInterval(interval);
    }
  }, [user, filters, sortBy]);

  const navigation = useNavigation();

  const navigateToForm = (name) => {
    navigation.navigate('Pdf', { name });
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
      // Si le filtre est déjà sélectionné, le retirer
      setFilters(filters.filter(item => item !== type));
    } else {
      // Sinon, l'ajouter
      setFilters([...filters, type]);
    }
    setVisible(false);
  };

  const handleSortBy = (type) => {
    setSortBy(type);
    setVisible(false); // Cacher le menu après sélection du tri
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
        <Text style={styles.pdfPreviewInfo}>{(item.type === 'r2c') ? "Intervention R2C" : "Intervention Multiserv"}</Text>
        <Text style={styles.pdfPreviewDate}>Fait le {formatDate(item.createdAt)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
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

        {/* Affichage des filtres sélectionnés */}
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

        {/* Liste des prévisualisations filtrées et triées */}
        <FlatList
          data={pdfPreviews}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.pdfListContainer}
          ListEmptyComponent={<Text style={styles.noFilesText}>Aucun fichier trouvé</Text>}
        />
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
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  pdfListContainer: {
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
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  pdfPreviewInfo: {
    marginTop: 10,
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
    borderRadius: 5,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    width: '30%', // Ajustez la largeur si nécessaire
    marginBottom: 20,
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFilter: {
    flexDirection: 'row',
    backgroundColor: '#2196f3',
    padding: 5,
    margin: 5,
    alignItems: 'center',
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
    color: '#2196f3',
    fontSize: 12,
  },
  noFilesText: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyForms;