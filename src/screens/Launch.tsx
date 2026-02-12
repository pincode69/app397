import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FishOneIcon } from '../components/icons/FishOneIcon';
import { FishTwoIcon } from '../components/icons/FishTwoIcon';
import { FishThreeIcon } from '../components/icons/FishThreeIcon';
import { FishFourIcon } from '../components/icons/FishFourIcon';

type Props = {
  onFinish: () => void;
};

const USER_NAME_KEY = '@user_name';

export default function LaunchScreen({ onFinish }: Props) {
  const [userName, setUserName] = useState('');

  const handleGetStarted = async () => {
    if (userName.trim()) {
      await AsyncStorage.setItem(USER_NAME_KEY, userName.trim());
    }
    await AsyncStorage.setItem('wasOnLaunch', 'true');
    onFinish();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.appTitle}>Icy Fish</Text>
              <Text style={styles.appSubtitle}>
                Catch fish in icy waters. Skill and patience will lead to success!
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome, Angler!</Text>
              <Text style={styles.cardDescription}>
                Start your journey into the world of fishing. Catch different types of fish,
                build your collection, and become the best angler!
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ENTER YOUR NAME</Text>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Angler Name"
                  placeholderTextColor="#999999"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <FishOneIcon width={50} height={25} color="#4FC3F7" />
                  {/* <Text style={styles.featureIcon}>🎣</Text> */}
                  <Text style={styles.featureText}>
                    Fishing — catch different types of fish in icy waters
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  {/* <Text style={styles.featureIcon}>🐟</Text> */}
                  <FishTwoIcon width={113} height={66} color="#4FC3F7" />
                  <Text style={styles.featureText}>
                    10 Fish Types — collect unique fish in your collection
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  {/* <Text style={styles.featureIcon}>⚡</Text> */}
                  <FishThreeIcon width={40} height={24} color="#4FC3F7" />
                  <Text style={styles.featureText}>
                    Quick Reaction — press the button at the right moment
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  {/* <Text style={styles.featureIcon}>📊</Text> */}
                  <FishFourIcon width={82} height={28} color="#4FC3F7" />
                  <Text style={styles.featureText}>
                    Statistics — track your catch and fishing time
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.getStartedButton,
                !userName.trim() && styles.getStartedButtonDisabled,
              ]}
              onPress={handleGetStarted}
              activeOpacity={0.8}
              disabled={!userName.trim()}
            >
              <Image
                source={require('@assets/images/ice-2.png')}
                style={styles.iceEffectBtnFirst}
                resizeMode="contain"
              />
              <Text style={styles.getStartedText}>Start Fishing</Text>
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0277BD',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Knewave'
  },
  appSubtitle: {
    fontSize: 16,
    color: '#0288D1',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Fredoka'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 26,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01579B',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  cardDescription: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Fredoka',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0277BD',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Knewave',
  },
  nameInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#B3E5FC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    fontFamily: 'Fredoka',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  featureIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#424242',
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Fredoka',
  },
  iceEffectBtnFirst: {
    position: 'absolute',
    width: 40,
    height: 100,
    top: -30,
    left: 0,
    justifyContent: 'flex-end'
  },
  getStartedButton: {
    backgroundColor: '#00BCD4', // Cyan/teal button
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#00BCD4',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    width: 200,
    position: 'relative'
  },
  getStartedButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#B0BEC5',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    fontFamily: 'Knewave',
  },
});
