import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';
import { ActivityIndicator, View, StyleSheet } from 'react-native';


import PomodoroTimer from '../components/PomodoroTimer';
import HomeScreen from '../HomeScreen';
import CustomBackButton from '../components/CustomBackButton'; 

const Stack = createStackNavigator();

function AppNavigator() {
  const [fontsLoaded] = useFonts({
    'MadimiOne_400Regular': MadimiOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#264653" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#264653', 
            height: 90, 
            elevation: 0,
            shadowOpacity: 0, 
            borderBottomWidth: 0,
          },
          headerTintColor: '#F4A261', 
          headerTitleStyle: {
            fontFamily: 'MadimiOne_400Regular',
            fontSize: 22,
            color: '#f2c59e', 
          },
          headerLeft: ({ tintColor }) => <CustomBackButton tintColor={tintColor} />,
          headerBackTitleVisible: false, 
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Welcome',
            headerShown: false, 
          }}
        />
        <Stack.Screen
          name="Pomodoro"
          component={PomodoroTimer}
          options={{
            title: 'Pomodoro Timer', 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E76F51',
  },
});

export default AppNavigator;