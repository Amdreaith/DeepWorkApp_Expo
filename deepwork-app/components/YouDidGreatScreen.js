// screens/YouDidGreatScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../styles/globalStyles'; 


const bmoImage = require('../assets/images/beezmofor_exitpage.png'); 

export default function YouDidGreatScreen() {
  const navigation = useNavigation();

 
  const handleGoHome = () => {
    navigation.popToTop(); 
  };

  return (
    
    <View style={styles.container}>
     
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundColor} /> 
      <SafeAreaView style={styles.safeArea}>
  
        <Text style={styles.headerText}>YOU DID GREAT!</Text>
      
        <Image
          source={bmoImage} 
          style={styles.bmoImage}
          resizeMode="contain" 
        />
        
  
        <TouchableOpacity style={styles.goHomeButton} onPress={handleGoHome}>
          <Text style={styles.goHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8de99', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
  },
  headerText: {
    fontSize: 40,
    fontFamily: 'MadimiOne_400Regular',
    color: colors.textPrimary, 
    marginBottom: 50, 
    textAlign: 'center', 
  },
  bmoImage: {
    width: '50%', 
    height: '40%', 
    maxWidth: 300, 
    maxHeight: 300, 
  },
  goHomeButton: {
    backgroundColor: colors.buttonPrimary, 
    paddingVertical: 15,
    paddingHorizontal: 30, 
    borderRadius: 10, 
    marginTop: 50, 
  },
  goHomeButtonText: {
    fontSize: 20,
    fontFamily: 'MadimiOne_400Regular',
    color: colors.buttonText,
  }
});