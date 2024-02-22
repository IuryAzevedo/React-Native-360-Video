import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import { Gyroscope } from 'expo-sensors';
import { ScreenOrientation } from 'expo';

export default function App() {
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const gyroscopeDataRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    async function setOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    setOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y, z }) => {
      gyroscopeDataRef.current = { x, y, z };
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (leftVideoRef.current && rightVideoRef.current) {
        const { x } = gyroscopeDataRef.current;
        const speedFactor = 1 + Math.abs(x / 10); // Adjust this factor as needed

        leftVideoRef.current.setRateAsync(speedFactor, true);
        rightVideoRef.current.setRateAsync(speedFactor, true);
      }
    }, 100); // Adjust the interval as needed

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.vrContainer}>
        <View style={styles.leftVideoContainer}>
          <Video
            ref={leftVideoRef}
            style={styles.video}
            source={require('./src/assets/surfing360.mp4')}
            useNativeControls={false}
            resizeMode="cover"
            isLooping
            shouldPlay
            progressUpdateIntervalMillis={50}
          />
        </View>
        <View style={styles.rightVideoContainer}>
          <Video
            ref={rightVideoRef}
            style={styles.video}
            source={require('./src/assets/surfing360.mp4')}
            useNativeControls={false}
            resizeMode="cover"
            isLooping
            shouldPlay
            progressUpdateIntervalMillis={50}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vrContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  leftVideoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  rightVideoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
