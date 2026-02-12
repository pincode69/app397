import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderComponent from '../components/HeaderComponent';
import { RootStackParamList } from '../../_layout';
import { ALL_EQUIPMENT, EquipmentItem, EquipmentType, getEquipmentImage } from '../data/equipmentData';
import { getBoughtEquipment, getSelectedEquipment, saveSelectedEquipment } from '../data/equipmentStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type EquipmentWithSelection = EquipmentItem & {
  isSelected: boolean;
};

export default function EquipmentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [boughtEquipment, setBoughtEquipment] = useState<EquipmentItem[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<{ [key: string]: string }>({});

  useFocusEffect(
    React.useCallback(() => {
      loadEquipment();
    }, [])
  );

  const loadEquipment = async () => {
    const boughtIds = await getBoughtEquipment();
    const selections = await getSelectedEquipment();
    
    const bought = ALL_EQUIPMENT.filter((item) => boughtIds.includes(item.id));
    setBoughtEquipment(bought);
    setSelectedEquipment(selections);
  };

  const handleSelectEquipment = async (itemId: string, equipmentType: EquipmentType) => {
    const newSelections = { ...selectedEquipment, [equipmentType]: itemId };
    setSelectedEquipment(newSelections);
    await saveSelectedEquipment(newSelections);
  };

  const getEquipmentByType = (type: EquipmentType): EquipmentWithSelection[] => {
    return boughtEquipment
      .filter((item) => item.type === type)
      .map((item) => ({
        ...item,
        isSelected: selectedEquipment[type] === item.id,
      }));
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
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.equipmentCard,
                  item.isSelected && styles.equipmentCardSelected,
                ]}
                onPress={() => handleSelectEquipment(item.id, item.type)}
              >
                {imageSource && (
                  <Image
                    source={imageSource}
                    style={styles.equipmentImage}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={[
                    styles.equipmentName,
                    item.isSelected && styles.equipmentNameSelected,
                  ]}
                >
                  {item.name}
                </Text>
                {item.isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const hasAnyEquipment = boughtEquipment.length > 0;

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <HeaderComponent
          title="Equipment"
          showAddBtn={false}
          showBackBtn={true}
          onBackPress={() => navigation.navigate('mainMenu')}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {hasAnyEquipment ? (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🎣 Your Equipment</Text>
                <Text style={styles.cardDescription}>
                  Select your fishing equipment. Each piece can help improve your fishing experience!
                </Text>
              </View>

              {renderEquipmentSection('hook', 'Hooks')}
              {renderEquipmentSection('float', 'Floats')}
              {renderEquipmentSection('bucket', 'Accessories')}
              {renderEquipmentSection('shoes', '')}
              {renderEquipmentSection('lifebuoy', '')}
              {renderEquipmentSection('lamp', '')}
              {renderEquipmentSection('cap', '')}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No Equipment</Text>
                <Text style={styles.emptyDescription}>
                  You don't have any equipment yet. Visit the shop to buy some!
                </Text>
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={() => navigation.navigate('shop')}
                >
                  <Text style={styles.shopButtonText}>🛒 Do Shopping</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  equipmentCardSelected: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F7FA',
    shadowColor: '#00BCD4',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    fontFamily: 'Fredoka',
  },
  equipmentNameSelected: {
    color: '#01579B',
    fontWeight: 'bold',
    fontFamily: 'Fredoka',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Fredoka',
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
    marginBottom: 24,
    fontFamily: 'Fredoka',
  },
  shopButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#00BCD4',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'Knewave',
  },
});
