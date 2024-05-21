import Pdf from 'react-native-pdf';
import React from 'react';
const MyForms = () => {

const PdfResource = { uri: 'www.example.com/pdf', cache: true };

<Pdf 
   trustAllCerts={false}
   source={PdfResource}
   style={styles.pdf}
   onLoadComplete={(numberOfPages, filePath) => {
      console.log(`number of pages: ${numberOfPages}`);
   }}
/>
}

export default MyForms;
