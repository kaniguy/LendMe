import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { AuthContext } from "../../context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import axios from "react-native-axios";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const Sign = ({ navigation: { replace } }) => {
  const [fontsLoaded] = useFonts({
    "Zona-regular": require("../../assets/font/ZonaPro-Regular.ttf"),
    "Zona-bold": require("../../assets/font/ZonaPro-Bold.otf"),
    "Zona-semibold": require("../../assets/font/ZonaPro-SemiBold.otf"),
    "Zona-Light": require("../../assets/font/ZonaPro-Light.otf"),
  });
  const [numeroPhone, setNumeroPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Fonction pour valider les numéros de téléphone
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Exemple pour valider un numéro de 10 chiffres
    return phoneRegex.test(phone);
  };

  const handleSignin = () => {
    console.log("Nom:", name);
    console.log("Numéro de téléphone:", numeroPhone);
    console.log("Mot de passe:", password);
    console.log("Confirmer mot de passe:", confirmPassword);

    // Vérification des champs
    if (!name || !numeroPhone || !password || !confirmPassword) {
      Toast.show('Tous les champs doivent être remplis.', { type: 'danger' });
      return;
    }

    // Vérification du format du numéro de téléphone
    if (!validatePhone(numeroPhone)) {
      Toast.show('Numéro de téléphone invalide.', { type: 'danger' });
      return;
    }

    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      Toast.show('Les mots de passe ne correspondent pas.', { type: 'danger' });
      return;
    }

    // Envoi de la requête API
    axios.post('http://192.168.1.9:8083/users/register', {
      names: name,
      numeroPhone: numeroPhone,
      password: password
    })
      .then(function (response) {
        console.log(response.data);
        setNumeroPhones(numeroPhone);
        setIdUser(response.data.id);
        setNavigate(true);
      })
      .catch(function (error) {
        console.log(error);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Erreur',
          textBody: 'Aucune donnée entrée ou erreur de réseau.',
          button: 'Fermer',
        });
      });
  };

  const { setNavigate, setNumeroPhones, setIdUser } = useContext(AuthContext);

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      onLayout={onLayoutRootView}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          marginVertical: 20,
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 25, fontFamily: "Zona-semibold" }}>
          Enregistrez-vous
        </Text>
      </View>

      <View
        style={{
          gap: 22,
          flex: 1,
          marginTop: 25,
          marginHorizontal: 20,
        }}
      >
        <View style={{ gap: 7 }}>
          <Text style={{ fontSize: 17, fontFamily: "Zona-regular" }}>
            Nom
          </Text>
          <TextInput
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderColor: "rgba(255, 183, 161, 0.29)",
              borderWidth: 2,
              borderRadius: 9,
            }}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={{ gap: 7 }}>
          <Text style={{ fontSize: 17, fontFamily: "Zona-regular" }}>
            Numéro Téléphone
          </Text>
          <TextInput
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderColor: "rgba(255, 183, 161, 0.29)",
              borderWidth: 2,
              borderRadius: 9,
            }}
            keyboardType="phone-pad"
            onChangeText={(text) => setNumeroPhone(text)}
          />
        </View>
        <View style={{ gap: 7 }}>
          <Text style={{ fontSize: 17, fontFamily: "Zona-regular" }}>
            Mot de passe
          </Text>
          <TextInput
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderColor: "rgba(255, 183, 161, 0.29)",
              borderWidth: 2,
              borderRadius: 9,
            }}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={{ gap: 7 }}>
          <Text style={{ fontSize: 17, fontFamily: "Zona-regular" }}>
            Confirmer mot de passe
          </Text>
          <TextInput
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderColor: "rgba(255, 183, 161, 0.29)",
              borderWidth: 2,
              borderRadius: 9,
            }}
            secureTextEntry={true}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
      </View>

      <AlertNotificationRoot></AlertNotificationRoot>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
        }}
      >
        <Pressable
          style={{
            width: "80%",
            paddingVertical: 15,
            backgroundColor: "#FFB7A1",
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            handleSignin();
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Zona-semibold",
              color: "white",
            }}
          >
            Inscription
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Sign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
