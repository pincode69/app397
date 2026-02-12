import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fish } from './types';

export type FishingSession = {
  id: string;
  date: string; // ISO date string
  location: string;
  fishingTime: number; // in seconds
  caughtFish: Fish[]; // fish caught during this session
};

const FISHING_JOURNAL_KEY = '@fishing_journal';

export async function getFishingJournal(): Promise<FishingSession[]> {
  try {
    const data = await AsyncStorage.getItem(FISHING_JOURNAL_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting fishing journal:', error);
    return [];
  }
}

export async function saveFishingJournal(sessions: FishingSession[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FISHING_JOURNAL_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving fishing journal:', error);
  }
}

export async function addFishingSession(session: FishingSession): Promise<void> {
  try {
    const journal = await getFishingJournal();
    journal.unshift(session); // Add to beginning (newest first)
    await saveFishingJournal(journal);
  } catch (error) {
    console.error('Error adding fishing session:', error);
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
