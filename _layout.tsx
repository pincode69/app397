import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainMenuScreen from './src/screens/MainMenu';
import SettingsScreen from './src/screens/Settings';
import AboutScreen from './src/screens/About';
import FishingScreen from './src/screens/Fishing';
import EquipmentScreen from './src/screens/Equipment';
import ShopScreen from './src/screens/Shop';
import FishingJournalScreen from './src/screens/FishingJournal';

export type RootStackParamList = {
  mainMenu: undefined;
  settings: undefined;
  about: undefined;
  fishing: undefined;
  equipment: undefined;
  shop: undefined;
  fishingJournal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  
  return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="mainMenu"
        >
          <Stack.Screen name="mainMenu" component={MainMenuScreen} />
          <Stack.Screen name="settings" component={SettingsScreen} />
          <Stack.Screen name="about" component={AboutScreen} />
          <Stack.Screen name="fishing" component={FishingScreen} />
          <Stack.Screen name="equipment" component={EquipmentScreen} />
          <Stack.Screen name="shop" component={ShopScreen} />
          <Stack.Screen name="fishingJournal" component={FishingJournalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default RootNavigator;
