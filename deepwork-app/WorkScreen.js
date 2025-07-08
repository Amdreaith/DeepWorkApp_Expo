// WorkScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from './styles/globalStyles';
import { useFonts, MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';
import footerImg from './assets/images/DreaithStudio_img_.png'; //

export default function WorkScreen() {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    'MadimiOne_400Regular': MadimiOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGotoPomodoro = () => {
    navigation.navigate('PomodoroScreen');
    console.log('Navigating to Pomodoro Screen');
  };

  const handleGotoDeepWork = () => {
   
    navigation.navigate('DeepWorkTimer');
    console.log('Navigating to Deep Work Screen');
  };

  
  const handleGotoChecklist = () => {
    navigation.navigate('Checklist'); 
    console.log('Navigating to Checklist Screen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get ready to set your intention timer.</Text>

      <TouchableOpacity style={styles.regularButton} onPress={handleGotoPomodoro}>
        <Text style={styles.buttonText}>Pomodoro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.regularButton} onPress={handleGotoDeepWork}>
        <Text style={styles.buttonText}>Deep Work</Text>
      </TouchableOpacity>

     
      <TouchableOpacity style={styles.regularButton} onPress={handleGotoChecklist}>
        <Text style={styles.buttonText}>Checklist</Text>
      </TouchableOpacity>

      <Image source={footerImg} style={styles.footerImg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 30,
  },
  title: {
    fontSize: 27,
    fontFamily: 'MadimiOne_400Regular',
    color: colors.textPrimary,
    marginBottom: 20,
    alignItems: 'center',
    margin: 30,
    marginBottom: 100,
  },
  regularButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
    width: '75%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: colors.buttonSecondary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
    width: '75%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontFamily: 'MadimiOne_400Regular',
  },
  footerImg: {
    position: 'absolute',
    bottom: 0,
    width: '150%',
    height: 120,
    resizeMode: 'contain',
  }
});