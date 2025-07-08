// screens/DeepWorkTimer.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
  ImageBackground,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors } from '../styles/globalStyles';


const POMODORO_BACKGROUND_IMAGE = require('../assets/images/work_background.jpg');
const DEEP_WORK_END_SOUND = require('../assets/work_end_chime.mp3');


const DEEP_WORK_DURATION = 4 * 60 * 60;

export default function DeepWorkTimer() {
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(DEEP_WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const soundObjectRef = useRef(new Audio.Sound());

  // --- Sound Management ---
  const loadAndPlaySound = useCallback(async () => {
    try {
      if (soundObjectRef.current._loaded) {
        await soundObjectRef.current.unloadAsync();
      }
      await soundObjectRef.current.loadAsync(DEEP_WORK_END_SOUND);
      await soundObjectRef.current.playAsync();
      console.log('Deep Work End Sound played!');
    } catch (error) {
      console.error('Error playing deep work end sound:', error);
      Alert.alert("Sound Error", "Could not play the end sound. Check asset path and permissions.");
    }
  }, []);

  const unloadSound = useCallback(async () => {
    try {
      if (soundObjectRef.current._loaded) {
        await soundObjectRef.current.unloadAsync();
        console.log('Deep Work End Sound unloaded!');
      }
    } catch (error) {
      console.error('Error unloading deep work end sound:', error);
    }
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      loadAndPlaySound();
      navigation.replace('YouDidGreat');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, navigation, loadAndPlaySound]);


  const lastActiveTime = useRef(Date.now());

  const handleAppStateChange = useCallback((nextAppState) => {
    if (nextAppState === 'active') {
      const backgroundTime = (Date.now() - lastActiveTime.current) / 1000;
      if (isRunning && backgroundTime > 0) {
        setTimeLeft(prevTime => Math.max(0, prevTime - Math.round(backgroundTime)));
      }
    } else {
      lastActiveTime.current = Date.now();
    }
  }, [isRunning]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);


  useFocusEffect(
    useCallback(() => {

      return () => {

        clearInterval(timerRef.current);
        setIsRunning(false);
        setTimeLeft(DEEP_WORK_DURATION);
        unloadSound();
      };
    }, [unloadSound])
  );

  // --- Format Time ---
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --- Handle Play/Pause ---
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // --- Handle Reset ---
  const resetTimer = () => {
    Alert.alert(
      "Reset Timer",
      "Are you sure you want to reset the Deep Work timer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: () => {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setTimeLeft(DEEP_WORK_DURATION);
            unloadSound();
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground
      source={POMODORO_BACKGROUND_IMAGE}
      style={styles.fullScreenBackground}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.sloganText}>Deep Work for the future</Text>

          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <TouchableOpacity onPress={toggleTimer} style={styles.playPauseButton}>
              <Ionicons
                name={isRunning ? 'pause' : 'play'}
                size={70}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.noRestText}>no rest</Text>


          <TouchableOpacity onPress={resetTimer} style={styles.resetButton}>
            <Ionicons name="refresh-circle-outline" size={40} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    width: '100%',
    padding: 10,
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sloganText: {
    fontSize: 20,
    fontFamily: 'MadimiOne_400Regular',
    color: colors.textSecondary,
    marginBottom: 50,
  },
  timerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.textSecondary,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 55.8,
    fontFamily: 'MadimiOne_400Regular',
    color: colors.buttonText,
    marginBottom: 10,
  },
  playPauseButton: {
    marginTop: 10,
  },
  noRestText: {
    fontSize: 18,
    fontFamily: 'MadimiOne_400Regular',
    color: colors.textSecondary,
    marginTop: 20,
  },
  resetButton: {
    marginTop: 40,
    padding: 10,
  }
});