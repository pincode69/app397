import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderComponent from '../components/HeaderComponent';
import CoinsDisplay from '../components/CoinsDisplay';
import { RootStackParamList } from '../../_layout';
import { ALL_EQUIPMENT, EquipmentItem, EquipmentType, getEquipmentImage } from '../data/equipmentData';
import { 
  getBoughtEquipment, 
  buyEquipment, 
  getPlayerCoins, 
  savePlayerCoins, 
  getTotalFishCount,
  getFishInventory,
  exchangeFishForCoins,
} from '../data/equipmentStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShopScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [boughtEquipment, setBoughtEquipment] = useState<string[]>([]);
  const [coins, setCoins] = useState<number>(100);
  const [fishCount, setFishCount] = useState<number>(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const loadData = async () => {
    const bought = await getBoughtEquipment();
    const playerCoins = await getPlayerCoins();
    const totalFish = await getTotalFishCount();
    setBoughtEquipment(bought);
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

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  const handleExchangeFish = async () => {
    const inventory = await getFishInventory();
    const totalFish = inventory.small + inventory.medium + inventory.large;
    
    if (totalFish === 0) {
      Alert.alert('No Fish', 'You don\'t have any fish to exchange!');
      return;
    }

    Alert.alert(
      'Exchange Fish for Coins',
      `Exchange rates:\n• 1 small fish = 1 coin\n• 1 medium fish = 2 coins\n• 1 large fish = 3 coins\n\nYou have:\n• ${inventory.small} small fish\n• ${inventory.medium} medium fish\n• ${inventory.large} large fish\n\nTotal coins: ${inventory.small * 1 + inventory.medium * 2 + inventory.large * 3}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exchange',
          onPress: async () => {
            const result = await exchangeFishForCoins();
            if (result.coins > 0) {
              Alert.alert(
                'Success!',
                `You exchanged ${result.exchanged.small} small, ${result.exchanged.medium} medium, and ${result.exchanged.large} large fish for ${result.coins} coins!`
              );
              await loadData();
            }
          },
        },
      ]
    );
  };

  const handleBuyEquipment = async (item: EquipmentItem) => {
    if (boughtEquipment.includes(item.id)) {
      Alert.alert('Already Owned', 'You already own this equipment!');
      return;
    }

    if (coins < item.price) {
      Alert.alert('Not Enough Coins', `You need ${item.price} coins to buy this item.`);
      return;
    }

    const success = await buyEquipment(item.id);
    if (success) {
      const newCoins = coins - item.price;
      await savePlayerCoins(newCoins);
      setCoins(newCoins);
      setBoughtEquipment([...boughtEquipment, item.id]);
      Alert.alert('Success!', `You bought ${item.name}!`);
    }
  };

  const getEquipmentByType = (type: EquipmentType) => {
    return ALL_EQUIPMENT.filter((item) => item.type === type);
  };

  const renderEquipmentSection = (type: EquipmentType, title: string) => {
    const items = getEquipmentByType(type);
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.equipmentGrid}>
          {items.map((item) => {
            const imageSource = getEquipmentImage(item);
            const isOwned = boughtEquipment.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.equipmentCard,
                  isOwned && styles.equipmentCardOwned,
                  !canAfford && !isOwned && styles.equipmentCardExpensive,
                ]}
                onPress={() => !isOwned && handleBuyEquipment(item)}
                disabled={isOwned}
              >
                {imageSource && (
                  <Image
                    source={imageSource}
                    style={styles.equipmentImage}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.equipmentName}>{item.name}</Text>
                {isOwned ? (
                  <View style={styles.ownedBadge}>
                    <Text style={styles.ownedBadgeText}>OWNED</Text>
                  </View>
                ) : (
                  <View style={styles.priceContainer}>
                    <Image
                      source={require('../../assets/images/coin.png')}
                      style={styles.priceCoinIcon}
                      resizeMode="contain"
                    />
                    <Text style={[styles.priceText, !canAfford && styles.priceTextExpensive]}>
                      {item.price}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <HeaderComponent
          title="Shop"
          showAddBtn={false}
          showBackBtn={true}
          onBackPress={() => navigation.navigate('mainMenu')}
        />

        <CoinsDisplay coins={coins} fishCount={fishCount} />

        <TouchableOpacity
          style={styles.exchangeButton}
          onPress={handleExchangeFish}
        >
          <Animated.Image
            source={require('@assets/images/exchange.png')}
            style={[
              styles.exchangeIcon,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
            resizeMode="contain"
          />
          <Text  numberOfLines={2} style={styles.exchangeButtonText}>Tap to Trade Fish for Coins</Text>
        </TouchableOpacity>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🛒 Equipment Shop</Text>
            <Text style={styles.cardDescription}>
              Buy new equipment to improve your fishing experience!
            </Text>
          </View>

          {renderEquipmentSection('hook', 'Hooks')}
          {renderEquipmentSection('float', 'Floats')}
          {renderEquipmentSection('bucket', 'Accessories')}
          {renderEquipmentSection('shoes', '')}
          {renderEquipmentSection('lifebuoy', '')}
          {renderEquipmentSection('lamp', '')}
          {renderEquipmentSection('cap', '')}
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
    marginBottom: 24,
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
    textAlign: 'center',
    fontFamily: 'Fredoka',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 16,
    fontFamily: 'Knewave',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  equipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    width: '30%',
    minWidth: 100,
    margin: 6,
    position: 'relative',
    shadowColor: '#0288D1',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentCardOwned: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
    opacity: 0.7,
  },
  equipmentCardExpensive: {
    opacity: 0.5,
    borderColor: '#F44336',
  },
  equipmentImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  equipmentName: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Fredoka',
  },
  priceContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceCoinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    fontFamily: 'Fredoka',
  },
  priceTextExpensive: {
    color: '#F44336',
  },
  ownedBadge: {
    marginTop: 4,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ownedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Fredoka',
  },
  exchangeButton: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF9800',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FF6F00',
  },
  exchangeIcon: {
    width: 120,
    height: 120,
    marginRight: 8,
  },
  exchangeButtonText: {
    textAlign: 'center',
    flexShrink: 1,
    color: '#FF6F00',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Knewave',
    letterSpacing: 0.5,
  },
});
