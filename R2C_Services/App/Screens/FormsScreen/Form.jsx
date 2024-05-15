import React, { useState,useRef } from "react";
import SignatureScreen from 'react-native-signature-canvas';
import {
  View,
  TextInput,
  question,
  Text,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";

const Form = () => {
  const [num, setNum] = useState("");
  const [date, setDate] = useState("");
  const [heureDebut, setheureDebut] = useState("");
  const [heureFin, setheureFin] = useState("");
  const [deplacement, setDeplacement] = useState("");

  const [adresse, setAdresse] = useState("");
  const [typeIntervention, setTypeIntervention] = useState(null);
  const [devis, setDevis] = useState(null);
  const [devisDesc, setDevisDesc] = useState(null);
  const [description, setDescription] = useState("");
  const [fourniture, setFourniture] = useState("");
  const [nomtech, setNomTech] = useState("");
  const [nomSite, setNomSite] = useState("");

  const option1 = ["Intervention", "Devis", "Selon devis"];
  const option2 = ["Oui", "Non"];

  const handleOptionSelect = (option) => {
    setTypeIntervention(option);
    setDevis(option);
  };
  const question1 = "Type d'intervention";
  const question2 = "Un devis est-il a suivre ?";
  const handleSubmit = () => {};
  const signatureRef = useRef();
  const [isSigning, setIsSigning] = useState(false); // État pour indiquer si l'utilisateur est en train de signer

  const handleSignature = () => {
    setIsSigning(false); 
  };

  const handleDragStart = () => {
    setIsSigning(true); 
  };
  return (
    <ScrollView >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={num}
          onChangeText={(text) => setNum(text)}
          placeholder="N° d'intervention"
        />
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={(text) => setDate(text)}
          placeholder="Date d'intervention"
        />
        <TextInput
          style={styles.input}
          value={heureDebut}
          onChangeText={(text) => setheureDebut(text)}
          placeholder="Heure d'arrivé"
        />
        <TextInput
          style={styles.input}
          value={heureFin}
          onChangeText={(text) => setheureFin(text)}
          placeholder="Heure de départ"
        />
        <TextInput
          style={styles.input}
          value={deplacement}
          onChangeText={(text) => setDeplacement(text)}
          placeholder="Nombre de déplacement"
        />
        <TextInput
          style={styles.input}
          value={adresse}
          onChangeText={(text) => setAdresse(text)}
          placeholder="Adresse d'intervention"
        />
        <Text style={styles.question}>{question1}</Text>
        <View style={styles.optionsContainer}>
          {option1.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelect(option)}
              color={typeIntervention === option ? "green" : "gray"}
            />
          ))}
        </View>
        <Text style={styles.question}>{question2}</Text>
        <View style={styles.optionsContainer}>
          {option2.map((option, index) => (
            <Button
              key={index}
              title={option}
              onPress={() => handleOptionSelect(option)}
              color={devis === option ? "green" : "gray"}
            />
          ))}
        </View>
        <TextInput
          style={styles.descriptionInput}
          value={devisDesc}
          onChangeText={(text) => setDevisDesc(text)}
          placeholder="(Si un devis est a suivre) Pour quel préstation ?"
          multiline={true}
          numberOfLines={4}
        />
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
          placeholder="Fournitures utilisées"
          multiline={true}
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          value={nomtech}
          onChangeText={(text) => setNomTech(text)}
          placeholder="Nom(s) Technicien(s)"
        />
        <TextInput
          style={styles.input}
          value={nomSite}
          onChangeText={(text) => setNomSite(text)}
          placeholder="Nom de la personne présente sur le site"
        />
        <Text style={styles.signatureLabel}>Signature :</Text>
        <View style={styles.signatureContainer}>
          <SignatureScreen
            ref={signatureRef}
           
            onDragStart={handleDragStart} 
            
          />
        </View>

        <Button title="Soumettre" onPress={handleSubmit} />
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
  signatureLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  signatureContainer: {
    width: '100%',
    height: 200, // Taille de la zone de signature
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default Form;
