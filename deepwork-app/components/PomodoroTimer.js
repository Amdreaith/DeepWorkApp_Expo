import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Modal, Pressable, ImageBackground, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/globalStyles';
import { useFonts, MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';
import { Audio } from 'expo-av';
import workBackgroundImg from '../assets/images/work_background.jpg';
import breakBackgroundImg from '../assets/images/break_background.png';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView

const BREAK_DURATION = 5 * 60;


const WORK_END_SOUND = require('../assets/work_end_chime.mp3');
const BREAK_END_SOUND = require('../assets/break_end_ring.mp3');


const CUSTOM_MUSIC_OPTIONS = [
  { name: 'Nature Sounds', path: require('../assets/nature.mp3') },
  { name: 'Cozy Jazz', path: require('../assets/cozy_jazz.mp3') },
  { name: 'Lofi ', path: require('../assets/lofi.mp3') },
  { name: '40HZ Binaural Beats', path: require('../assets/binaural.mp3') },
];

export default function PomodoroTimer() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'MadimiOne_400Regular': MadimiOne_400Regular,
  });


  const [workEndSound, setWorkEndSound] = useState();
  const [breakEndSound, setBreakEndSound] = useState();
  const [playButtonSoundObject, setPlayButtonSoundObject] = useState();


  const [selectedMusic, setSelectedMusic] = useState(CUSTOM_MUSIC_OPTIONS[0]);


  const CUSTOM_WORK_DURATIONS = [25, 35, 40, 45, 50, 60];

  const [workDuration, setWorkDuration] = useState(45 * 60);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkMode, setIsWorkMode] = useState(true);
  const [isDurationModalVisible, setIsDurationModalVisible] = useState(false);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const intervalRef = useRef(null);


  useEffect(() => {
    async function loadSounds() {
      try {

        if (workEndSound) await workEndSound.unloadAsync();
        if (breakEndSound) await breakEndSound.unloadAsync();
        if (playButtonSoundObject) await playButtonSoundObject.unloadAsync();

        const { sound: newWorkEndSound } = await Audio.Sound.createAsync(WORK_END_SOUND);
        setWorkEndSound(newWorkEndSound);

        const { sound: newBreakEndSound } = await Audio.Sound.createAsync(BREAK_END_SOUND);
        setBreakEndSound(newBreakEndSound);


        const { sound: newPlayButtonSoundObject } = await Audio.Sound.createAsync(selectedMusic.path, { isLooping: true, volume: 0.5 }); // Loop background music
        setPlayButtonSoundObject(newPlayButtonSoundObject);
      } catch (error) {
        console.error("Error loading sounds:", error);
      }
    }

    loadSounds();


    return () => {
      if (workEndSound) workEndSound.unloadAsync();
      if (breakEndSound) breakEndSound.unloadAsync();
      if (playButtonSoundObject) playButtonSoundObject.unloadAsync();
    };
  }, [selectedMusic]);


  useEffect(() => {
    if (isRunning) {

      if (playButtonSoundObject && !playButtonSoundObject._loaded) {
        playButtonSoundObject.playAsync().catch(e => console.error("Error playing background music:", e));
      } else if (playButtonSoundObject && playButtonSoundObject._loaded) {
        playButtonSoundObject.setStatusAsync({ shouldPlay: true }).catch(e => console.error("Error setting background music status to play:", e));
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);


            if (playButtonSoundObject) {
              playButtonSoundObject.stopAsync().catch(e => console.error("Error stopping background music:", e));
            }


            if (isWorkMode) {

              if (workEndSound) {
                workEndSound.replayAsync().catch(e => console.error("Error playing work end sound:", e));
              }
              setIsWorkMode(false);
              return BREAK_DURATION;
            } else {

              if (breakEndSound) {
                breakEndSound.replayAsync().catch(e => console.error("Error playing break end sound:", e));
              }
              setIsWorkMode(true);
              return workDuration;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);

      if (playButtonSoundObject) {
        playButtonSoundObject.pauseAsync().catch(e => console.error("Error pausing background music:", e));
      }
    }


    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorkMode, workDuration, workEndSound, breakEndSound, playButtonSoundObject]);

  if (!fontsLoaded) {
    return null;
  }


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  const handleToggleTimer = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };


  const handleResetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsWorkMode(true);
    setTimeLeft(workDuration);


    if (workEndSound) workEndSound.stopAsync().catch(e => console.error("Error stopping work end sound on reset:", e));
    if (breakEndSound) breakEndSound.stopAsync().catch(e => console.error("Error stopping break end sound on reset:", e));
    if (playButtonSoundObject) playButtonSoundObject.stopAsync().catch(e => console.error("Error stopping play button sound on reset:", e));
  };


  const handleGoBack = () => {
    clearInterval(intervalRef.current);

    if (workEndSound) workEndSound.stopAsync().catch(e => console.error("Error stopping work end sound on back:", e));
    if (breakEndSound) breakEndSound.stopAsync().catch(e => console.error("Error stopping break end sound on back:", e));
    if (playButtonSoundObject) playButtonSoundObject.stopAsync().catch(e => console.error("Error stopping play button sound on back:", e));
    navigation.goBack();
  };


  const handleCustomizeWorkDuration = (minutes) => {
    const newDuration = minutes * 60;
    setWorkDuration(newDuration);
    setTimeLeft(newDuration);
    setIsWorkMode(true);
    setIsRunning(false);
    setIsDurationModalVisible(false);


    if (workEndSound) workEndSound.stopAsync().catch(e => console.error("Error stopping work end sound on customize:", e));
    if (breakEndSound) breakEndSound.stopAsync().catch(e => console.error("Error stopping break end sound on customize:", e));
    if (playButtonSoundObject) playButtonSoundObject.stopAsync().catch(e => console.error("Error stopping play button sound on customize:", e));
  };


  const handleSelectMusic = (musicOption) => {
    setSelectedMusic(musicOption);
    setIsRunning(false);
    setIsMusicModalVisible(false);

  };

  const currentBackground = isWorkMode ? workBackgroundImg : breakBackgroundImg;

  return (
    <ImageBackground
      source={currentBackground}
      style={styles.fullScreenBackground}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}> {/* Added SafeAreaView */}
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>

          <Text style={styles.headerTitle}>
            {isWorkMode ? 'Your Pomodoro, Your Way' : 'TAKE A BREAK'}
          </Text>


          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            {/* Play/Pause Button */}
            <TouchableOpacity style={styles.playPauseButton} onPress={handleToggleTimer}>
              <Text style={styles.playPauseIcon}>{isRunning ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>
          </View>


          {isWorkMode && (
            <Text style={styles.musicStatusText}>
              Current Music: {selectedMusic.name}
            </Text>
          )}

          {isWorkMode && (
            <Text style={styles.restTimeText}>
              Rest time: {BREAK_DURATION / 60} minutes
            </Text>
          )}


          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleResetTimer}>
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setIsDurationModalVisible(true)}>
              <Text style={styles.actionButtonText}>Customize Duration</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setIsMusicModalVisible(true)}>
              <Text style={styles.actionButtonText}>Customize Music</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isDurationModalVisible}
            onRequestClose={() => setIsDurationModalVisible(!isDurationModalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Choose Work Duration</Text>
                {CUSTOM_WORK_DURATIONS.map((duration) => (
                  <Pressable
                    key={duration}
                    style={styles.durationOption}
                    onPress={() => handleCustomizeWorkDuration(duration)}
                  >
                    <Text style={styles.durationOptionText}>{duration} minutes</Text>
                  </Pressable>
                ))}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setIsDurationModalVisible(!isDurationModalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isMusicModalVisible}
            onRequestClose={() => setIsMusicModalVisible(!isMusicModalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Choose Background Music</Text>
                {CUSTOM_MUSIC_OPTIONS.map((musicOption) => (
                  <Pressable
                    key={musicOption.name}
                    style={[
                      styles.durationOption,
                      selectedMusic.name === musicOption.name && styles.selectedOption
                    ]}
                    onPress={() => handleSelectMusic(musicOption)}
                  >
                    <Text style={styles.durationOptionText}>{musicOption.name}</Text>
                  </Pressable>
                ))}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setIsMusicModalVisible(!isMusicModalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView> {/* Close SafeAreaView */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: { // New style for SafeAreaView
    flex: 1,
  },
  header: { // New style for the header container
    width: '100%',
    padding: 10,
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    left: 0,
    zIndex: 10,
  },
  backButton: { // New style for the back button
    padding: 5,
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 28,
    color: '#f2c59e',
    marginBottom: 40,
    textAlign: 'center',
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#f2c59e',
    borderColor: '#2A9D8F',
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 60,
    color: colors.textPrimary,
  },
  playPauseButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2A9D8F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playPauseIcon: {
    fontSize: 35,
    color: '#264653',
  },
  musicStatusText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 18,
    color: '#f2c59e',
    marginBottom: 10,
  },
  restTimeText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 20,
    color: '#f2c59e',
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#2A9D8F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    fontFamily: 'MadimiOne_400Regular',
    color: '#264653',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 24,
    marginBottom: 20,
    color: colors.textSecondary,
  },
  durationOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#F4A261',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  durationOptionText: {
    fontFamily: 'MadimiOne_400Regular',
    fontSize: 18,
    color: colors.textPrimary,
  },
  selectedOption: {
    backgroundColor: '#2A9D8F',
    borderColor: colors.textPrimary,
    borderWidth: 2,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: '#2A9D8F',
  },
  textStyle: {
    color: '#264653',
    fontFamily: 'MadimiOne_400Regular',
    textAlign: 'center',
    fontSize: 18,
  },
});
