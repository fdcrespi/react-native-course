import React, {useState} from "react";
import {Text , View, StyleSheet, Image, Button, Alert, TouchableOpacity, Platform} from "react-native";
import image from './assets/icon.jpg';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

const App = () => {

  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Los permisos para acceder a la libreria debe ser aceptados");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    /* Para compartir en la web */
    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri });
    }
  }

  const openShareDialogAsync = async () => {
    // si no esta disponible para compartir la imagen
    if (!(await Sharing.isAvailableAsync())) {
      alert(`La imagen esta disponible en : ${selectedImage.remoteUri}`);
      return;
    }
    //para compartir lo que tenemos en el estado
    await Sharing.shareAsync(selectedImage.localUri);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una imagen</Text>
      <TouchableOpacity  onPress={openImagePickerAsync}>
        <Image style={styles.image} 
          //source={{uri: 'https://picsum.photos/200/200'}}
          source = {selectedImage ? { uri: selectedImage.localUri } : image}
        />
        {/* <Button 
          onPress={() => Alert.alert("Hello word")}
          title="Click me" 
          color="primary"
        /> */}
      </TouchableOpacity>
      {
        selectedImage  ? 
        (
          <TouchableOpacity style={styles.button} onPress={openShareDialogAsync}>
            <Text style={styles.buttontext}>Compartir</Text>
          </TouchableOpacity>
        ) : ( null )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  title: {
    fontSize: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 90,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: 'blue',
    padding: 7,
    marginTop: 10
  },
  buttontext: {
    color: 'yellow',
    fontSize: 20,
  }
});

export default App;