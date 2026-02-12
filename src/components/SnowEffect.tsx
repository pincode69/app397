import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Snowflake = {
  id: number;
  x: number;
  y: Animated.Value;
  size: number;
  duration: number;
  opacity: number;
};

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create 30 snowflakes
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 30; i++) {
      flakes.push({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: new Animated.Value(-20),
        size: Math.random() * 5 + 3, // 3-8px
        duration: Math.random() * 4000 + 3000, // 3-7 seconds
        opacity: Math.random() * 0.5 + 0.5, // 0.5-1.0
      });
    }
    setSnowflakes(flakes);

    // Animate each snowflake
    flakes.forEach((flake) => {
      const animate = () => {
        flake.y.setValue(-20);
        Animated.timing(flake.y, {
          toValue: SCREEN_HEIGHT + 20,
          duration: flake.duration,
          useNativeDriver: true,
        }).start(() => {
          // Reset position and restart animation
          flake.x = Math.random() * SCREEN_WIDTH;
          animate();
        });
      };
      animate();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {snowflakes.map((flake) => (
        <Animated.View
          key={flake.id}
          style={[
            styles.snowflake,
            {
              left: flake.x,
              transform: [{ translateY: flake.y }],
              width: flake.size,
              height: flake.size,
              borderRadius: flake.size / 2,
              opacity: flake.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});
