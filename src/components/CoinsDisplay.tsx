import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

type Props = {
  coins: number;
  fishCount?: number;
};

export default function CoinsDisplay({ coins, fishCount = 0 }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.itemContainer, styles.firstItem]}>
        <Image
          source={require('@assets/images/coin.png')}
          style={styles.coinIcon}
          resizeMode="contain"
        />
        <Text style={styles.coinsText}>{coins}</Text>
      </View>
      
      <View style={styles.itemContainer}>
        <Image
          source={require('@assets/images/fish-count-icon.png')}
          style={styles.fishIcon}
          resizeMode="contain"
        />
        <Text style={styles.fishText}>{fishCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  firstItem: {
    marginLeft: 0,
  },
  coinIcon: {
    width: 54,
    height: 54,
    marginRight: 8,

    shadowColor: '#FFF',
    shadowOpacity: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 8,
    paddingVertical: 5
  },
  coinsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E65100',
    fontFamily: 'Knewave',
    letterSpacing: 1.2,
    textShadowColor: '#006eff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  fishIcon: {
    width: 54,
    height: 54,
    marginRight: 8,

    shadowColor: '#FFF',
    shadowOpacity: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 8,
    paddingVertical: 5
  },
  fishText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#01579B',
    fontFamily: 'Knewave',
    letterSpacing: 1.2,
    textShadowColor: '#4FC3F7',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
