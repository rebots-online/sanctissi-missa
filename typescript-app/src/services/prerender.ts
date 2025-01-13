import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addDays, parseISO } from 'date-fns';
import { LiturgicalCalendar } from './calendar';
import { LiturgicalTexts } from './texts';

interface PrerenderedDay {
  metadata: {
    season: string;
    celebration?: string;
    rank: number;
    color: string;
    allowsVigil: boolean;
    commemorations: string[];
  };
  mass: unknown;
  office: {
    lauds?: unknown;
    prime?: unknown;
    terce?: unknown;
    sext?: unknown;
    none?: unknown;
    vespers?: unknown;
    compline?: unknown;
  };
}

export class PrerenderedContent {
  private static STORAGE_PREFIX = '@sanctissimissa:prerendered:';
  private static HOURS = ['lauds', 'prime', 'terce', 'sext', 'none', 'vespers', 'compline'];

  static async initialize(): Promise<void> {
    try {
      // Check if today is prerendered
      const today = format(new Date(), 'yyyy-MM-dd');
      const content = await this.getDay(today);
      
      if (!content) {
        // Prerender today and tomorrow
        await this.prerenderWeek(today);
      }
    } catch (error) {
      console.error('Failed to initialize PrerenderedContent:', error);
      throw error;
    }
  }

  static async getDay(date: string): Promise<PrerenderedDay | null> {
    try {
      const key = `${this.STORAGE_PREFIX}${date}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get prerendered day:', error);
      return null;
    }
  }

  static async prerenderWeek(startDate: string): Promise<void> {
    try {
      const date = parseISO(startDate);
      
      // Prerender 7 days starting from the given date
      for (let i = 0; i < 7; i++) {
        const currentDate = format(addDays(date, i), 'yyyy-MM-dd');
        await this.prerenderDay(currentDate);
      }
    } catch (error) {
      console.error('Failed to prerender week:', error);
      throw error;
    }
  }

  private static async prerenderDay(date: string): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}${date}`;
      
      // Check if already prerendered
      const existing = await AsyncStorage.getItem(key);
      if (existing) return;

      // Get day info
      const dayInfo = LiturgicalCalendar.getDayInfo(date);
      
      // Prerender mass
      const mass = await LiturgicalTexts.getMassProper(dayInfo);
      
      // Prerender office hours
      const office: PrerenderedDay['office'] = {};
      for (const hour of this.HOURS) {
        office[hour as keyof PrerenderedDay['office']] = 
          await LiturgicalTexts.getOfficeHour(dayInfo, hour);
      }

      // Store prerendered content
      const content: PrerenderedDay = {
        metadata: {
          season: dayInfo.season,
          celebration: dayInfo.celebration,
          rank: dayInfo.rank,
          color: dayInfo.color,
          allowsVigil: dayInfo.allowsVigil,
          commemorations: dayInfo.commemorations,
        },
        mass,
        office,
      };

      await AsyncStorage.setItem(key, JSON.stringify(content));
    } catch (error) {
      console.error('Failed to prerender day:', error);
      throw error;
    }
  }

  static async clearOldContent(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prerenderedKeys = keys.filter(key => key.startsWith(this.STORAGE_PREFIX));
      
      // Keep only last 2 weeks of content
      const twoWeeksAgo = format(addDays(new Date(), -14), 'yyyy-MM-dd');
      
      const keysToRemove = prerenderedKeys.filter(key => {
        const date = key.replace(this.STORAGE_PREFIX, '');
        return date < twoWeeksAgo;
      });

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('Failed to clear old content:', error);
      throw error;
    }
  }
}