import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type WindLine = {
  id: number;
  x: Animated.Value;
  y: number;
  length: number;
  speed: number;
  opacity: number;
};

export default function WindEffect() {
  const [windLines, setWindLines] = useState<WindLine[]>([]);

  useEffect(() => {
    const lines: WindLine[] = [];
    for (let i = 0; i < 20; i++) {
      lines.push({
        id: i,
        x: new Animated.Value(0),
        y: Math.random() * SCREEN_HEIGHT,
        length: Math.random() * 40 + 20,
        speed: Math.random() * 2000 + 1500,
        opacity: Math.random() * 0.4 + 0.3,
      });
    }
    setWindLines(lines);

    lines.forEach((line) => {
      const animate = () => {
        line.x.setValue(-SCREEN_WIDTH - 100);
        line.y = Math.random() * SCREEN_HEIGHT;
        Animated.timing(line.x, {
          toValue: SCREEN_WIDTH + 100,
          duration: line.speed,
          useNativeDriver: true,
        }).start(() => {
          animate();
        });
      };
      animate();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {windLines.map((line) => (
        <Animated.View
          key={line.id}
          style={[
            styles.windLine,
            {
              transform: [{ translateX: line.x }],
              top: line.y,
              width: line.length,
              opacity: line.opacity,
            },
          ]}
        >
          <Text style={styles.windSymbol}>~</Text>
        </Animated.View>
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
  windLine: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  windSymbol: {
    fontSize: 24,
    color: '#B0BEC5',
    fontWeight: 'bold',
  },
});
