import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderComponent from '../components/HeaderComponent';
import { RootStackParamList } from '../../_layout';
import { getFishingJournal, FishingSession, formatDate, formatTime } from '../data/fishingJournal';
import { getUserName } from '../data/equipmentStorage';
import { Fish } from '../data/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FishingJournalScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [sessions, setSessions] = useState<FishingSession[]>([]);
  const [userName, setUserName] = useState<string>('Angler');

  useFocusEffect(
    React.useCallback(() => {
      loadJournal();
      loadUserName();
    }, [])
  );

  const loadJournal = async () => {
    const journal = await getFishingJournal();
    setSessions(journal);
  };

  const loadUserName = async () => {
    const name = await getUserName();
    setUserName(name);
  };

  const getFishImage = (fish: Fish) => {
    const fishImages: { [key: number]: any } = {
      1: require('../../assets/images/fish/1.png'),
      2: require('../../assets/images/fish/2.png'),
      3: require('../../assets/images/fish/3.png'),
      4: require('../../assets/images/fish/4.png'),
      5: require('../../assets/images/fish/5.png'),
      6: require('../../assets/images/fish/6.png'),
      7: require('../../assets/images/fish/7.png'),
      8: require('../../assets/images/fish/8.png'),
      9: require('../../assets/images/fish/9.png'),
      10: require('../../assets/images/fish/10.png'),
      11: require('../../assets/images/fish/11.png'),
      12: require('../../assets/images/fish/12.png'),
      13: require('../../assets/images/fish/13.png'),
      14: require('../../assets/images/fish/14.png'),
      15: require('../../assets/images/fish/15.png'),
      16: require('../../assets/images/fish/16.png'),
      17: require('../../assets/images/fish/17.png'),
      18: require('../../assets/images/fish/18.png'),
      19: require('../../assets/images/fish/19.png'),
    };
    return fishImages[fish.imageIndex] || fishImages[1];
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <HeaderComponent
          title="Fishing Journal"
          showAddBtn={false}
          showBackBtn={true}
          onBackPress={() => navigation.navigate('mainMenu')}
        />

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {sessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No Fishing Sessions</Text>
                <Text style={styles.emptyDescription}>
                  Your fishing sessions will appear here after you start fishing.
                </Text>
              </View>
            </View>
          ) : (
            sessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <Text style={styles.cardTitle}>Basic Information</Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{formatDate(session.date)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{session.location}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fishing Time</Text>
                  <Text style={styles.infoValue}>{formatTime(session.fishingTime)}</Text>
                </View>

                {/* Recent Catches */}
                {session.caughtFish && session.caughtFish.length > 0 && (
                  <View style={styles.catchesSection}>
                    <Text style={styles.catchesTitle}>Recent Catches</Text>
                    <View style={styles.catchesList}>
                      {session.caughtFish.map((fish) => (
                        <View key={fish.id} style={styles.catchItem}>
                          <Image
                            source={getFishImage(fish)}
                            style={styles.catchFishImage}
                            resizeMode="contain"
                          />
                          <View style={styles.catchFishInfo}>
                            <Text style={styles.catchFishType}>{fish.type}</Text>
                            <Text style={styles.catchFishSize}>{fish.size}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
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
  welcomeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  sessionCard: {
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
    marginBottom: 20,
    fontFamily: 'Knewave',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0277BD',
    fontFamily: 'Knewave',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#424242',
    fontFamily: 'Fredoka',
    flex: 2,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01579B',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Fredoka',
  },
  catchesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  catchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 16,
    fontFamily: 'Knewave',
  },
  catchesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  catchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 6,
    minWidth: 140,
  },
  catchFishImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  catchFishInfo: {
    flex: 1,
  },
  catchFishType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#01579B',
    fontFamily: 'Knewave',
    marginBottom: 2,
  },
  catchFishSize: {
    fontSize: 12,
    color: '#757575',
    fontFamily: 'Fredoka',
  },
});
