import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderComponent from '../components/HeaderComponent';
import CoinsDisplay from '../components/CoinsDisplay';
import { RootStackParamList } from '../../_layout';
import { getPlayerCoins, getTotalFishCount } from '../data/equipmentStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MainMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [coins, setCoins] = useState<number>(0);
  const [fishCount, setFishCount] = useState<number>(0);

  const loadData = async () => {
    const playerCoins = await getPlayerCoins();
    const totalFish = await getTotalFishCount();
    setCoins(playerCoins);
    setFishCount(totalFish);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // Also reload when screen comes into focus via navigation listener
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground
      source={require('@assets/images/bg.png')}
      style={styles.bg}
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <HeaderComponent
            title="Home"
            showAddBtn={false}
          />
          <CoinsDisplay coins={coins} fishCount={fishCount} />
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('fishing')}
            >
              <Image
                source={require('@assets/images/ice-1.png')}
                style={styles.iceEffectBtnFirst}
                resizeMode="contain"
              />
              <Text style={styles.menuButtonText}>Start Fishing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuButton, styles.equipmentButton]}
              onPress={() => navigation.navigate('equipment')}
            >
              <Image
                source={require('@assets/images/ice-2.png')}
                style={styles.iceEffectBtnSecond}
                resizeMode="contain"
              />
              <Text style={styles.menuButtonText}>Equipment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuButton, styles.shopButton]}
              onPress={() => navigation.navigate('shop')}
            >
              <Image
                source={require('@assets/images/ice-3.png')}
                style={styles.iceEffectBtnThird}
                resizeMode="contain"
              />
              <Text style={styles.menuButtonText}>Shop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuButton, styles.journalButton]}
              onPress={() => navigation.navigate('fishingJournal')}
            >
              <Image
                source={require('@assets/images/ice-2.png')}
                style={styles.iceEffectBtnFourth}
                resizeMode="contain"
              />
              <Text style={styles.menuButtonText}>Fishing Journal</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingBottom: 80
  },
  iceEffectBtnFirst: {
    position: 'absolute',
    width: 250,
    height: 100,
    top: -40
  },
  iceEffectBtnSecond: {
    position: 'absolute',
    width: 60,
    height: 100,
    top: -20,
    left: 0,
    justifyContent: 'flex-end'
  },
  iceEffectBtnThird: {
    position: 'absolute',
    width: 220,
    height: 120,
    top: -38,
    right: -8,
  },
  iceEffectBtnFourth: {
    position: 'absolute',
    width: 60,
    height: 100,
    top: -20,
    right: -10,
    justifyContent: 'flex-end'
  },
  menuButton: {
    position: 'relative',
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    height: 80,
    borderRadius: 16,
    width: 250,
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  equipmentButton: {
    backgroundColor: '#4FC3F7',
  },
  shopButton: {
    backgroundColor: '#FF9800',
  },
  journalButton: {
    backgroundColor: '#9C27B0',
    marginBottom: 0,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    fontFamily: 'Knewave',
    textShadowColor: 'rgb(0, 21, 255)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
