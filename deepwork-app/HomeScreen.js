import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from './assets/images/logo_DeepWork.png';
import { colors } from './styles/globalStyles';
import footerImg from './assets/images/DreaithStudio_img_.png';
import { useFonts, MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';


export default function HomeScreen() { 
  let [fontsLoaded] = useFonts({
    'MadimiOne_400Regular': MadimiOne_400Regular,
  });

  const navigation = useNavigation(); 

  if (!fontsLoaded) {
    return null;
  }

  const handleStart = () => {
    console.log('Start button pressed! Navigating to WorkScreen...');
    navigation.navigate('Work'); 
  };

  const handleExit = () => {
    console.log('Exit button pressed!');
   
  };

  const handleGoToSettings = () => { 
    navigation.navigate('Settings'); 
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>DeepWorkNow</Text>

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.buttonText}>start</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.buttonText}>exit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.startButton, { marginTop: 20 }]}
        onPress={handleGoToSettings}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

  
      <Image source={footerImg} style={styles.footerImg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    color: colors.textPrimary,
    marginBottom: 60,
    fontFamily: 'MadimiOne_400Regular',
  },
  startButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginBottom: 20,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 22,
    textTransform: 'lowercase',
    fontFamily: 'MadimiOne_400Regular',
  },
  exitButton: {
    backgroundColor: colors.buttonSecondary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerImg: {
    position: 'absolute',
    bottom: 0,
    width: '150%',
    height: 120,
    resizeMode: 'contain',
  }
});


