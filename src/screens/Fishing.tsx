import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  ImageBackground
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderComponent from '../components/HeaderComponent';
import FishingModal, { WeatherType } from '../components/FishingModal';
import SnowEffect from '../components/SnowEffect';
import WindEffect from '../components/WindEffect';
import { GameState, Fish } from '../data/types';
import {
  getInitialGameState,
  startFishing,
  stopFishing,
  onPullPress,
  checkCatch,
  updateRodState,
} from '../data/gameLogic';
import { addCaughtFish } from '../data/equipmentStorage';
import { addFishingSession } from '../data/fishingJournal';
import { RootStackParamList } from '../../_layout';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FishingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');
  const [weather, setWeather] = useState<WeatherType>('Clear');
  const [sessionStartDate, setSessionStartDate] = useState<string>('');
  const [currentSessionTime, setCurrentSessionTime] = useState<number>(0);
  const rodStateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameState.isFishing) {
      const updateRod = () => {
        setGameState((prev) => ({
          ...prev,
          rodState: updateRodState(),
        }));
      };

      updateRod();

      const interval = setInterval(() => {
        updateRod();
      }, 1000 + Math.random() * 1000);

      rodStateIntervalRef.current = interval;

      return () => {
        if (rodStateIntervalRef.current) {
          clearInterval(rodStateIntervalRef.current);
        }
      };
    } else {
      if (rodStateIntervalRef.current) {
        clearInterval(rodStateIntervalRef.current);
        rodStateIntervalRef.current = null;
      }
    }
  }, [gameState.isFishing]);

  useEffect(() => {
    if (gameState.isFishing && gameState.startTime) {
      const timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - gameState.startTime!) / 1000);
        setCurrentSessionTime(elapsedSeconds);
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    } else {
      setCurrentSessionTime(0);
    }
  }, [gameState.isFishing, gameState.startTime]);

  useEffect(() => {
    if (gameState.currentFish) {
      const progress = gameState.pullProgress / gameState.pullRequired;
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnimation.setValue(0);
    }
  }, [gameState.pullProgress, gameState.pullRequired, gameState.currentFish]);

  useEffect(() => {
    if (gameState.currentFish && gameState.pullProgress >= gameState.pullRequired) {
      setGameState((prev) => {
        return checkCatch(prev);
      });
    }
  }, [gameState.pullProgress, gameState.pullRequired, gameState.currentFish]);

  useEffect(() => {
    if (gameState.caughtFish.length > 0) {
      const lastCaughtFish = gameState.caughtFish[gameState.caughtFish.length - 1];
      if (lastCaughtFish && lastCaughtFish.size) {
        console.log('Saving caught fish with size:', lastCaughtFish.size);
        addCaughtFish(lastCaughtFish.size).catch((error) => {
          console.error('Error saving caught fish:', error);
        });
      }
    }
  }, [gameState.caughtFish.length]);

  const handleStartFishing = () => {
    setShowModal(true);
  };

  const handleModalStart = (selectedLocation: string, selectedWeather: WeatherType) => {
    setLocation(selectedLocation);
    setWeather(selectedWeather);
    setSessionStartDate(new Date().toISOString());
    setGameState((prev) => startFishing(prev));
  };

  const handleStopFishing = async () => {
    // Calculate fishing time before stopping
    const currentTime = gameState.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0;
    
    const stoppedState = stopFishing(gameState);
    
    // Save fishing session to journal
    if (sessionStartDate && location && currentTime > 0) {
      await addFishingSession({
        id: Date.now().toString(),
        date: sessionStartDate,
        location: location,
        fishingTime: currentTime,
        caughtFish: gameState.caughtFish, // Save caught fish from this session
      });
    }
    
    setGameState(stoppedState);
    setLocation('');
    setWeather('Clear');
    setSessionStartDate('');
  };

  const handlePull = () => {
    setGameState((prev) => {
      const newState = onPullPress(prev);
      if (newState.currentFish && newState.pullProgress >= newState.pullRequired) {
        return checkCatch(newState);
      }
      return newState;
    });
  };

  const getRodImage = () => {
    switch (gameState.rodState) {
      case 'idle':
        return require('../../assets/images/game/idle.png');
      case 'light':
        return require('../../assets/images/game/light.gif');
      case 'strong':
        return require('../../assets/images/game/strong.gif');
      default:
        return require('../../assets/images/game/idle.png');
    }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRodStateText = () => {
    switch (gameState.rodState) {
      case 'idle':
        return 'Rod is calm';
      case 'light':
        return 'Light movement';
      case 'strong':
        return 'STRONG MOVEMENT - TAP NOW!';
      default:
        return '';
    }
  };

  const getRodStateColor = () => {
    switch (gameState.rodState) {
      case 'idle':
        return '#757575';
      case 'light':
        return '#FF9800';
      case 'strong':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  return (
    <ImageBackground
      source={require('@assets/images/game/fishing-bg.png')}
      style={styles.bg}
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <HeaderComponent
            title="Fishing"
            showAddBtn={false}
            showBackBtn={true}
            onBackPress={() => navigation.navigate('mainMenu')}
          />

          <View style={styles.content}>
            {/* Location Display */}
            {gameState.isFishing && location && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>{location}</Text>
              </View>
            )}

            {/* Snow Effect */}
            {gameState.isFishing && weather === 'Snowy' && <SnowEffect />}
            {gameState.isFishing && weather === 'Windy' && <WindEffect />}

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Caught:</Text>
                <Text style={styles.statValue}>{gameState.caughtFish.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Time:</Text>
                <Text style={styles.statValue}>
                  {formatTime(gameState.isFishing ? currentSessionTime : gameState.totalFishingTime)}
                </Text>
              </View>
            </View>

            <View style={styles.rodContainer}>
              <Image
                source={require('@assets/images/game/hole.png')}
                style={styles.holeImage}
                resizeMode="contain"
              />
              <Image
                source={getRodImage()}
                style={styles.rodImage}
                resizeMode="contain"
              />

              <Image
                source={require('@assets/images/game/hole-cover.png')}
                style={styles.holeCoverImage}
                resizeMode="contain"
              />
              
              <Text style={[styles.rodStateText, { color: getRodStateColor() }]}>
                {getRodStateText()}
              </Text>
            </View>

            {gameState.currentFish && (
              <View style={styles.fishContainer}>
                <Image
                  source={getFishImage(gameState.currentFish)}
                  style={styles.fishImage}
                  resizeMode="contain"
                />
                <View style={styles.fishInfo}>
                  <Text style={styles.fishType}>{gameState.currentFish.type}</Text>
                  <Text style={styles.fishSize}>
                    Size: {gameState.currentFish.size}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          {
                            width: progressAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            }),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {gameState.pullProgress} / {gameState.pullRequired}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.buttonsContainer}>
              {!gameState.isFishing ? (
                <TouchableOpacity
                  style={[styles.button, styles.startButton]}
                  onPress={handleStartFishing}
                >
                  <Text style={styles.buttonText}>Start Fishing</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.pullButton,
                      gameState.rodState !== 'strong' && styles.pullButtonDisabled,
                    ]}
                    onPress={handlePull}
                    disabled={gameState.rodState !== 'strong'}
                  >
                    <Text style={styles.buttonText}>
                      {gameState.currentFish ? 'Pull!' : 'Tap!'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.stopButton]}
                    onPress={handleStopFishing}
                  >
                    <Text style={styles.buttonText}>Stop</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <FishingModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onStart={handleModalStart}
          />
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
    paddingVertical: 20,
  },
  locationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    fontFamily: 'Fredoka',
  },
  statValue: {
    color: '#01579B',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Knewave',
  },
  rodContainer: {
    position: 'absolute',
    bottom: 0,
    left: -100,
    alignItems: 'center',
    padding: 24,
  },
  holeCoverImage: {
    position: 'absolute',
    bottom: 70,
    right: -80,
    width: 250,
    height: 33,
    justifyContent: 'flex-end',
  },
  holeImage: {
    position: 'absolute',
    bottom: 70,
    right: -80,
    width: 250,
    height: 85.22,
  },
  rodImage: {
    width: 400,
    height: 400,
    marginBottom: 15,
  },
  rodStateText: {
    paddingLeft: 50,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Knewave',
  },
  fishContainer: {
    position: 'absolute',
    right: 0,
    bottom: 80,
    width: '50%',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  fishImage: {
    width: 80,
    height: 60,
  },
  fishInfo: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  fishType: {
    color: '#01579B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Knewave',
  },
  fishSize: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
    fontFamily: 'Fredoka',
  },
  progressContainer: {
    alignSelf: 'stretch',
    flex: 1
  },
  progressBar: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  progressText: {
    color: '#424242',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Fredoka',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0288D1',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  startButton: {
    position: 'absolute',
    backgroundColor: '#00BCD4',
  },
  pullButton: {
    backgroundColor: '#4CAF50',
  },
  pullButtonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.6,
  },
  stopButton: {
    backgroundColor: '#F44336',
    top: 80
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'Knewave',
  },
});
