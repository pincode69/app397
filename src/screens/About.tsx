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

export default function AboutScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <HeaderComponent
          title="About"
          showAddBtn={false}
          showBackBtn={true}
          onBackPress={() => navigation.navigate('mainMenu')}
        />
        
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎣 Icy Fish</Text>
            <Text style={styles.cardDescription}>
              A fun and engaging fishing game where you catch different types of fish
              in icy waters. Test your reflexes and timing to become the best angler!
            </Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How to Play</Text>
              <Text style={styles.sectionText}>
                • Start fishing and watch the rod{'\n'}
                • Wait for strong movement{'\n'}
                • Tap the button when the rod shakes strongly{'\n'}
                • Quickly tap to pull the fish out{'\n'}
                • Collect all 10 fish types!
              </Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <Text style={styles.sectionText}>
                • 10 unique fish types{'\n'}
                • 3 different sizes (small, medium, large){'\n'}
                • Track your catch statistics{'\n'}
                • Fun and engaging gameplay
              </Text>
            </View>
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
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#01579B',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  cardDescription: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Fredoka',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 12,
    fontFamily: 'Knewave',
  },
  sectionText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
    fontFamily: 'Fredoka',
  },
});
