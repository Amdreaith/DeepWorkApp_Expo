import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from './styles/globalStyles';
import { useFonts, MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';
import Constants from 'expo-constants';
import LikeUsPopup from './components/LikeUsPopup';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Legal');


  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [userRating, setUserRating] = useState(0); 
  const [isSoundOn, setIsSoundOn] = useState(true); 


  const [isLikeUsModalVisible, setLikeUsModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    'MadimiOne_400Regular': MadimiOne_400Regular,
  });

  if (!fontsLoaded) {
    return null; 
  }

  // --- Button Handlers ---

  const handleLegalLink = (url, title) => {
    Alert.alert(
      title,
      `You are about to open: ${url}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: () => Linking.openURL(url).catch(err => console.error("Couldn't open URL", err)) }
      ]
    );
  };


  const handleGenericPopUp = (buttonName, customMessage = null) => {
    const title = "Feature Coming Soon!";
    const message = customMessage || `You clicked "${buttonName}". This feature is under development.`;
    Alert.alert(title, message);
  };

  const handleRateUsPress = () => {
    setUserRating(0); 
    setRatingModalVisible(true);
  };


  const handleLikeUsPress = () => {
    setLikeUsModalVisible(true);
  };

  const submitRating = () => {
    if (userRating > 0) {
      Alert.alert("Thank You!", `You rated us ${userRating} stars! Your feedback is appreciated.`);
    } else {
      Alert.alert("Please Rate", "Please select a star rating before submitting.");
    }
    setRatingModalVisible(false);
  };

  const toggleSound = () => {
    setIsSoundOn(prevState => !prevState);

    Alert.alert("Sound Setting", `Sound is now ${!isSoundOn ? 'ON' : 'OFF'}`);
  };

 
  const onToggleSoundSwitch = () => {
    setIsSoundOn(previousState => !previousState);

    Alert.alert("Sound Setting", `Music is now ${!isSoundOn ? 'ON' : 'OFF'}`);
  };


  // --- JSX ---

  return (
    <View style={styles.fullContainer}>
    
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Legal' && styles.activeTab]}
          onPress={() => setActiveTab('Legal')}
        >
          <Text style={[styles.tabText, activeTab === 'Legal' && styles.activeTabText]}>Legal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Help' && styles.activeTab]}
        
          onPress={() => {
            setActiveTab('Help');
            handleGenericPopUp('Help', 'CONTACT US AT dreaithstudio@em4i1.official');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'Help' && styles.activeTabText]}>Help</Text>
        </TouchableOpacity>
    
       
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.contentContainer}>
      
        <Text style={styles.versionText}>
          Version: {Constants.manifest.version || '4.0.392'} (32)
        </Text>
        <Text style={styles.copyrightText}>
          Copyright 2025
        </Text>
        <Text style={styles.versionText}>
          DLC Version: 06/03/20125 18:34:31
        </Text>

      
        <Text style={styles.legalInfoLabel}>Legal Info:</Text>
        <TouchableOpacity
          style={styles.legalButton}
          onPress={() => handleLegalLink('https://example.com/privacy-policy', 'Privacy Policy')}
        >
          <Text style={styles.legalButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.legalButton}
          onPress={() => handleLegalLink('https://example.com/terms-of-service', 'Terms Of Service')}
        >
          <Text style={styles.legalButtonText}>Terms Of Service</Text>
        </TouchableOpacity>

      
        <Text style={styles.settingLabel}>Sound:</Text>
        <TouchableOpacity
          style={[
            styles.onOffButton,
            isSoundOn ? styles.onButtonActive : styles.offButtonActive,
          ]}
          onPress={toggleSound}
        >
          <Text style={styles.onOffButtonText}>
            {isSoundOn ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>

    
        <View style={styles.switchContainer}>
          <Text style={styles.settingLabel}>Music:</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isSoundOn ? colors.buttonPrimary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onToggleSoundSwitch}
            value={isSoundOn}
          />
        </View>


      </View>


      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.rateUsButton]}
          onPress={handleRateUsPress} 
        >
          <Text style={styles.bottomButtonText}>Rate Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomButton, styles.likeUsButton]}
          onPress={handleLikeUsPress} 
        >
          <Text style={styles.bottomButtonText}>Like Us</Text>
        </TouchableOpacity>
      </View>


      <Modal
        animationType="fade"
        transparent={true}
        visible={isRatingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRatingModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Rate Our App!</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setUserRating(star)}
                      style={styles.starButton}
                    >
                      <Text style={[
                        styles.starText,
                        userRating >= star ? styles.starFilled : styles.starEmpty
                      ]}>
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.selectedRatingText}>
                    {userRating > 0 ? `You selected: ${userRating} star(s)` : 'Tap stars to rate'}
                </Text>

                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={submitRating}>
                    <Text style={styles.modalButtonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setRatingModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ADDED: Like Us Popup */}
      <LikeUsPopup
        visible={isLikeUsModalVisible}
        onClose={() => setLikeUsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.textPrimary,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 10,
    position: 'relative',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.buttonText,
  },
  activeTab: {
    backgroundColor: colors.buttonText,
  },
  tabText: {
    fontFamily: 'MadimiOne_400Regular',
    color: colors.buttonText,
    fontSize: 16,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#DDC9A3',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  versionText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  copyrightText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 15,
  },
  legalInfoLabel: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  legalButton: {
    backgroundColor: colors.buttonText,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  legalButtonText: {
    fontFamily: 'MadimiOne_400Regular',
    color: colors.textPrimary,
    fontSize: 16,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateUsButton: {
    backgroundColor: '#6DB758',
  },
  likeUsButton: {
    backgroundColor: '#6DB758',
  },
  gPlusButton: {
    backgroundColor: '#DC4A38',
  },
  gPlusCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  moreGamesButton: {
    backgroundColor: '#555555',
  },
  bottomButtonText: {
    fontFamily: 'MadimiOne_400Regular',
    color: 'white',
    fontSize: 15,
  },

  // --- NEW STYLES FOR ON/OFF BUTTON ---
  settingLabel: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  onOffButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15, // Add some space below it
    width: '50%', // Adjust width as needed
    alignItems: 'center',
  },
  onButtonActive: {
    backgroundColor: '#4CAF50', // Green for ON
  },
  offButtonActive: {
    backgroundColor: '#F44336', // Red for OFF
  },
  onOffButtonText: {
    fontFamily: 'MadimiOne_400Regular',
    color: 'white',
    fontSize: 18,
  },
  // Styles for the Switch component layout
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%', // Adjust as needed
    marginBottom: 15,
    marginTop: 10, // Add space from the previous element
  },


  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  modalTitle: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  starButton: {
    paddingHorizontal: 5,
  },
  starText: {
    fontSize: 40,
  },
  starEmpty: {
    color: '#CCCCCC',
  },
  starFilled: {
    color: '#FFD700',
  },
  selectedRatingText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontFamily: 'MadimiOne_400Regular',
    color: colors.buttonText,
    fontSize: 16,
  },
});