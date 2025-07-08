import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomBackButton = ({ tintColor }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.backButtonContainer}
      onPress={() => navigation.goBack()}
    >
    
      <Text style={[styles.backButtonIcon, { color: tintColor }]}>
        ⬅
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingLeft: 15, 
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  backButtonIcon: {
    fontSize: 24,
  },
});

export default CustomBackButton;