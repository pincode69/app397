import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export type WeatherType = 'Snowy' | 'Windy' | 'Clear';

export const LOCATIONS = [
  "Wolf's Breath Lake",
  'Frozen Bear Crossing',
  'Shimmering Ice Flats',
  'Deadwater Ice Lake',
  'Frozen Pine Lake',
  'Icewind River Bend',
  'Snowfall Reservoir',
  'Frostbite Bay',
  'White Elk Lake',
  'Glacier Creek',
  'Northern Lights Lake',
  'Iron Ice Quarry Pond',
  'Silent Tundra Lake',
  'Crystal Frost Reservoir',
];

export const WEATHER_OPTIONS: WeatherType[] = ['Snowy', 'Windy', 'Clear'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onStart: (location: string, weather: WeatherType) => void;
};

export default function FishingModal({ visible, onClose, onStart }: Props) {
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[0]);
  const [selectedWeather, setSelectedWeather] = useState<WeatherType>('Clear');

  const handleStart = () => {
    onStart(selectedLocation, selectedWeather);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Location & Weather</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Location</Text>
            <ScrollView style={styles.dropdownContainer} nestedScrollEnabled>
              {LOCATIONS.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.dropdownItem,
                    selectedLocation === location && styles.dropdownItemSelected,
                  ]}
                  onPress={() => setSelectedLocation(location)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedLocation === location && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Weather</Text>
            <View style={styles.weatherContainer}>
              {WEATHER_OPTIONS.map((weather) => (
                <TouchableOpacity
                  key={weather}
                  style={[
                    styles.weatherButton,
                    selectedWeather === weather && styles.weatherButtonSelected,
                  ]}
                  onPress={() => setSelectedWeather(weather)}
                >
                  <Text
                    style={[
                      styles.weatherButtonText,
                      selectedWeather === weather && styles.weatherButtonTextSelected,
                    ]}
                  >
                    {weather}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start Fishing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#0288D1',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Knewave',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0277BD',
    marginBottom: 12,
    fontFamily: 'Knewave',
  },
  dropdownContainer: {
    maxHeight: 150,
    borderWidth: 2,
    borderColor: '#B3E5FC',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemSelected: {
    backgroundColor: '#E0F7FA',
    borderBottomColor: '#4FC3F7',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#424242',
    fontFamily: 'Fredoka',
  },
  dropdownItemTextSelected: {
    color: '#01579B',
    fontWeight: 'bold',
  },
  weatherContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  weatherButton: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B3E5FC',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    margin: 6,
  },
  weatherButtonSelected: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F7FA',
  },
  weatherButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    fontFamily: 'Fredoka',
  },
  weatherButtonTextSelected: {
    color: '#01579B',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#BDBDBD',
    alignItems: 'center',
    marginRight: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Knewave',
  },
  startButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    marginLeft: 6,
    shadowColor: '#00BCD4',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Knewave',
  },
});
