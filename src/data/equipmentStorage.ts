import AsyncStorage from '@react-native-async-storage/async-storage';
import { EquipmentItem, ALL_EQUIPMENT } from './equipmentData';
import { FishSize } from './types';

const BOUGHT_EQUIPMENT_KEY = '@bought_equipment';
const SELECTED_EQUIPMENT_KEY = '@selected_equipment';
const COINS_KEY = '@player_coins';
const TOTAL_FISH_COUNT_KEY = '@total_fish_count';
const FISH_INVENTORY_KEY = '@fish_inventory';
const USER_NAME_KEY = '@user_name';

// Default starter equipment (free items)
const DEFAULT_BOUGHT_EQUIPMENT = ['hook1', 'float1', 'bucket'];

export async function getBoughtEquipment(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(BOUGHT_EQUIPMENT_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with default equipment
    await saveBoughtEquipment(DEFAULT_BOUGHT_EQUIPMENT);
    return DEFAULT_BOUGHT_EQUIPMENT;
  } catch (error) {
    console.error('Error getting bought equipment:', error);
    return DEFAULT_BOUGHT_EQUIPMENT;
  }
}

export async function saveBoughtEquipment(equipmentIds: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(BOUGHT_EQUIPMENT_KEY, JSON.stringify(equipmentIds));
  } catch (error) {
    console.error('Error saving bought equipment:', error);
  }
}

export async function buyEquipment(equipmentId: string): Promise<boolean> {
  try {
    const bought = await getBoughtEquipment();
    if (bought.includes(equipmentId)) {
      return false; // Already owned
    }
    bought.push(equipmentId);
    await saveBoughtEquipment(bought);
    return true;
  } catch (error) {
    console.error('Error buying equipment:', error);
    return false;
  }
}

export async function getSelectedEquipment(): Promise<{ [key: string]: string }> {
  try {
    const data = await AsyncStorage.getItem(SELECTED_EQUIPMENT_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Default selections
    const defaultSelections: { [key: string]: string } = {
      hook: 'hook1',
      float: 'float1',
      bucket: 'bucket',
      shoes: '',
      lifebuoy: '',
    };
    await saveSelectedEquipment(defaultSelections);
    return defaultSelections;
  } catch (error) {
    console.error('Error getting selected equipment:', error);
    return {};
  }
}

export async function saveSelectedEquipment(selections: { [key: string]: string }): Promise<void> {
  try {
    await AsyncStorage.setItem(SELECTED_EQUIPMENT_KEY, JSON.stringify(selections));
  } catch (error) {
    console.error('Error saving selected equipment:', error);
  }
}

export async function getPlayerCoins(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(COINS_KEY);
    if (data) {
      return parseInt(data, 10);
    }
    // Start with 100 coins
    await savePlayerCoins(100);
    return 100;
  } catch (error) {
    console.error('Error getting player coins:', error);
    return 100;
  }
}

export async function savePlayerCoins(coins: number): Promise<void> {
  try {
    await AsyncStorage.setItem(COINS_KEY, coins.toString());
  } catch (error) {
    console.error('Error saving player coins:', error);
  }
}

export type FishInventory = {
  small: number;
  medium: number;
  large: number;
};

export async function getFishInventory(): Promise<FishInventory> {
  try {
    const data = await AsyncStorage.getItem(FISH_INVENTORY_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all keys exist
      return {
        small: parsed.small || 0,
        medium: parsed.medium || 0,
        large: parsed.large || 0,
      };
    }
    const defaultInventory: FishInventory = { small: 0, medium: 0, large: 0 };
    await saveFishInventory(defaultInventory);
    return defaultInventory;
  } catch (error) {
    console.error('Error getting fish inventory:', error);
    return { small: 0, medium: 0, large: 0 };
  }
}

export async function saveFishInventory(inventory: FishInventory): Promise<void> {
  try {
    // Ensure all values are numbers
    const safeInventory: FishInventory = {
      small: inventory.small || 0,
      medium: inventory.medium || 0,
      large: inventory.large || 0,
    };
    await AsyncStorage.setItem(FISH_INVENTORY_KEY, JSON.stringify(safeInventory));
    // Update total count
    const total = safeInventory.small + safeInventory.medium + safeInventory.large;
    await AsyncStorage.setItem(TOTAL_FISH_COUNT_KEY, total.toString());
    console.log('Saved fish inventory:', safeInventory, 'Total:', total);
  } catch (error) {
    console.error('Error saving fish inventory:', error);
  }
}

export async function getTotalFishCount(): Promise<number> {
  try {
    const inventory = await getFishInventory();
    const total = (inventory.small || 0) + (inventory.medium || 0) + (inventory.large || 0);
    console.log('Total fish count:', total, inventory);
    return total;
  } catch (error) {
    console.error('Error getting total fish count:', error);
    return 0;
  }
}

export async function addCaughtFish(size: FishSize): Promise<number> {
  try {
    const inventory = await getFishInventory();
    // Ensure the size key exists and is a number
    if (size === 'small') {
      inventory.small = (inventory.small || 0) + 1;
    } else if (size === 'medium') {
      inventory.medium = (inventory.medium || 0) + 1;
    } else if (size === 'large') {
      inventory.large = (inventory.large || 0) + 1;
    }
    await saveFishInventory(inventory);
    const total = inventory.small + inventory.medium + inventory.large;
    console.log(`Added ${size} fish. Total: ${total}`, inventory);
    return total;
  } catch (error) {
    console.error('Error adding caught fish:', error);
    return 0;
  }
}

export async function exchangeFishForCoins(): Promise<{ coins: number; exchanged: FishInventory }> {
  try {
    const inventory = await getFishInventory();
    const exchangeRates = {
      small: 1,
      medium: 2,
      large: 3,
    };
    
    const coinsEarned = 
      inventory.small * exchangeRates.small +
      inventory.medium * exchangeRates.medium +
      inventory.large * exchangeRates.large;
    
    if (coinsEarned === 0) {
      return { coins: 0, exchanged: { small: 0, medium: 0, large: 0 } };
    }
    
    // Add coins
    const currentCoins = await getPlayerCoins();
    await savePlayerCoins(currentCoins + coinsEarned);
    
    // Reset inventory
    const exchanged = { ...inventory };
    await saveFishInventory({ small: 0, medium: 0, large: 0 });
    
    return { coins: coinsEarned, exchanged };
  } catch (error) {
    console.error('Error exchanging fish for coins:', error);
    return { coins: 0, exchanged: { small: 0, medium: 0, large: 0 } };
  }
}

export function getBoughtEquipmentItems(): EquipmentItem[] {
  // This will be used with async data, but for type safety
  return ALL_EQUIPMENT;
}

export async function getUserName(): Promise<string> {
  try {
    const name = await AsyncStorage.getItem(USER_NAME_KEY);
    return name || 'Angler';
  } catch (error) {
    console.error('Error getting user name:', error);
    return 'Angler';
  }
}
