import React, { useState, useRef } from "react";
import SignatureScreen from "react-native-signature-canvas";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import { Alert } from "react-native";

const FormR2C = ({ text, onOK}) => {
  const [num, setNum] = useState("");
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [technicien1, setTechnicien1] = useState("");
  const [technicien2, setTechnicien2] = useState("");
  const [ordre, setOrdre] = useState("");
  const [societe, setSociete] = useState("");
  const [adresse, setAdresse] = useState("");
  const [typeIntervention, setTypeIntervention] = useState(null);
  const [devis, setDevis] = useState(null);
  const [prestation, setPrestation] = useState(null);
  const [AdresseFacturation, setAdresseFacturation] = useState("");
  const [description, setDescription] = useState("");
  const [deplacement, setDeplacement] = useState("");
  const [prixDeplacement, setPrixDeplacement] = useState("");
  const [prixMD, setPrixMD] = useState("");
  const [heureMD, setHeureMD] = useState("");
  const [tva, setTVA] = useState("");
  const [fourniture, setFourniture] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [signature, setSignature] = useState("");
  const option1 = ["Dépanage", "Entretien", "Travaux"];
  const option2 = ["Contrat", "Devis", "Facture"];
  const option3 = ["Demandée", "Réalisée"];
  const option4 = ["10%", "20%"];
  const navigation = useNavigation();

  const htmlContent = ``;

  const handleOptionSelectTypeIntervention = (option) => {
    setTypeIntervention(option);
  };
  const handleOptionSelectDevis = (option) => {
    setDevis(option);
  };
  const handleOptionSelectPresation = (option) => {
    setPrestation(option);
  };

  const handleOptionSelectTVA = (option) => {
    setTVA(option);
  };

  const handleSignature = (signature) => {
    setSignature(signature);
    if (onOK) {
      onOK(signature);
    }
    setSignature(signature);
  };

  const signatureRef = useRef();

  const handleEmpty = () => {
    console.log("Signature vide");
  };

  const handleClear = () => {
    console.log("Signature effacée avec succès !");
  };

  const handleEnd = () => {
    signatureRef.current.readSignature();
  };

  const handleData = (data) => {};

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
      setSignature("");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const askPermission = () => {
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Pdf creator needs External Storage Write Permission",
            message: "Pdf creator needs access to Storage data in your SD Card",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          createPDF();
        } else {
          alert("WRITE_EXTERNAL_STORAGE permission denied");
        }
      } catch (err) {
        alert("Write permission err", err);
        console.warn(err);
      }
    }
    if (Platform.OS === "android") {
      requestExternalWritePermission();
    } else {
      createPDF();
    }
  };
  const createPDF = async () => {
    let options = {
      //Content to print
      html: htmlContent,
      //File Name
      fileName: "my-test",
      //File directory
      directory: "Download",

      base64: true,

      width: 595.28,

      height: 841.89,
    };

    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);
    Alert.alert(
      "Exporter avec succès",
      "" /*file.filePath*/,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Ouvrir", onPress: () => openFile(file.filePath) },
      ],
      { cancelable: true }
    );
  };
  const openFile = (filepath) => {
    const path = filepath; // absolute-path-to-my-local-file.
    FileViewer.open(path)
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
      });
  };

  const handleSubmit = () => {};

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={num}
          onChangeText={(text) => setNum(text)}
          placeholder="N° d'intervention"
        />
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
        <TextInput
          style={styles.input}
          value={technicien1}
          onChangeText={(text) => setTechnicien1(text)}
          placeholder="Technicien"
        />
        <TextInput
          style={styles.input}
          value={technicien2}
          onChangeText={(text) => setTechnicien2(text)}
          placeholder="Technicien"
        />
        <Text style={styles.question}>Type d'intervention</Text>
        <View style={styles.optionsContainer}>
          {option1.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelectTypeIntervention(option)}
              color={typeIntervention === option ? "green" : "gray"}
            />
          ))}
        </View>
        <Text style={styles.question}>Intervention selon :</Text>
        <View style={styles.optionsContainer}>
          {option2.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelectDevis(option)}
              color={devis === option ? "green" : "gray"}
            />
          ))}
        </View>
        <Text style={styles.question}>Adresse d'intervention :</Text>
        <TextInput
          style={styles.input}
          value={ordre}
          onChangeText={(text) => setOrdre(text)}
          placeholder="Ordre de"
        />
        <TextInput
          style={styles.input}
          value={societe}
          onChangeText={(text) => setSociete(text)}
          placeholder="Nom/Société"
        />
        <TextInput
          style={styles.input}
          value={adresse}
          onChangeText={(text) => setAdresse(text)}
          placeholder="Adresse d'intervention"
        />

        <TextInput
          style={styles.input}
          value={AdresseFacturation}
          onChangeText={(text) => setAdresseFacturation(text)}
          placeholder="Adresse de facturation (si differente)"
        />
        <Text style={styles.question}>Préstation :</Text>
        <View style={styles.optionsContainer}>
          {option3.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelectPresation(option)}
              color={prestation === option ? "green" : "gray"}
            />
          ))}
        </View>
    
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Description"
          multiline={true}
          numberOfLines={4}
        />
        <TextInput
          style={styles.descriptionInput}
          value={fourniture}
          onChangeText={(text) => setFourniture(text)}
          placeholder="Sortie de matériel"
          multiline={true}
          numberOfLines={4}
        />
        <Text style={styles.question}>Déplacement :</Text>
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={deplacement}
            onChangeText={(text) => setDeplacement(text)}
            placeholder="Nombre"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={prixDeplacement}
            onChangeText={(text) => setPrixDeplacement(text)}
            placeholder="Prix"
          />
        </View>

        <Text style={styles.question}>Main d'oeuvre :</Text>
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={heureMD}
            onChangeText={(text) => setHeureMD(text)}
            placeholder="Heure"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={prixMD}
            onChangeText={(text) => setPrixMD(text)}
            placeholder="Prix"
          />
        </View>

        <Text style={styles.question}>TVA :</Text>
        <View style={styles.optionsContainer}>
          {option4.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelectTVA(option)}
              color={tva === option ? "green" : "gray"}
            />
          ))}
        </View>

        <TextInput
          style={styles.input}
          value={heureDebut}
          onChangeText={(text) => setHeureDebut(text)}
          placeholder="Heure d'arrivée"
        />
        <TextInput
          style={styles.input}
          value={heureFin}
          onChangeText={(text) => setHeureFin(text)}
          placeholder="Heure de départ"
        />
        <Text style={styles.signatureLabel}>Signature Client:</Text>
        <View style={styles.signatureContainer}>
          <SignatureScreen
            ref={signatureRef}
            onEnd={handleEnd}
            onOK={handleSignature}
            onEmpty={handleEmpty}
            onClear={handleClear}
            onGetData={handleData}
            descriptionText={text}
          />
        </View>
        <Button title="Effacer" onPress={handleClearSignature} />

        <TouchableOpacity style={styles.submitButton} onPress={askPermission}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionInput: {
    width: "100%",
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 120,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  halfInput: {
    width: "48%", // Adjust width to have some space between inputs
  },
  signatureLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  signatureContainer: {
    width: "100%",
    height: 200, // Taille de la zone de signature
    borderWidth: 1,
    borderColor: "#000",
  },
  submitButton: {
    marginBottom: 50,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default FormR2C;
