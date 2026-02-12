import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderComponent from '../components/HeaderComponent';
import { RootStackParamList } from '../../_layout';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <HeaderComponent
          title="Settings"
          showAddBtn={false}
          showBackBtn={true}
          onBackPress={() => navigation.navigate('mainMenu')}
        />
        
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Game Settings</Text>
            <Text style={styles.cardDescription}>
              Configure your fishing experience and preferences.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#01579B',
    marginBottom: 12,
    fontFamily: 'Knewave',
  },
  cardDescription: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    fontFamily: 'Fredoka',
  },
});
