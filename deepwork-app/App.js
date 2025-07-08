import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import WorkScreen from './WorkScreen';
import { colors } from './styles/globalStyles';
import SettingsScreen from './SettingsScreen';
import PomodoroTimer from './components/PomodoroTimer';
import Checklist from './components/Checklist';
import DeepWorkTimer from './components/DeepWorkTimer';
import YouDidGreatScreen from './components/YouDidGreatScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Work"
          component={WorkScreen}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: colors.buttonPrimary, 
            },
            headerTintColor: colors.background,
            headerTitleStyle: {
              
              fontFamily: 'MadimiOne_400Regular',
            },
          }}
        />
         <Stack.Screen
          name="Settings"
          component={SettingsScreen} 
          options={{
            title: 'App Settings', 
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: {
              fontFamily: 'MadimiOne_400Regular',
            },
           
          }}
        />
        <Stack.Screen
          name="PomodoroScreen"
          component={PomodoroTimer}
          options={{
            headerShown: false, 
          }}
        />

      <Stack.Screen
    name="Checklist" 
    component={Checklist}
    options={{
      title: 'My Checklist', 
      headerStyle: {
        backgroundColor: colors.background, 
      },
      headerTintColor: colors.textPrimary, 
      headerTitleStyle: {
        fontFamily: 'MadimiOne_400Regular', 
      },
    }}
  />

       <Stack.Screen
            name="DeepWorkTimer" 
            component={DeepWorkTimer}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="YouDidGreat" 
            component={YouDidGreatScreen}
            options={{ headerShown: false }} 
          />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;