import { LiturgicalCalendar, LiturgicalDay } from './calendar';
import { LiturgicalTexts, MassProper, OfficeHourProper } from './texts';
import { PrerenderedContent } from './prerender';
import { addDays, format, parseISO } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class DataManager {
  private static instance: DataManager;
  private isInitialized = false;
  private preloadQueue: string[] = [];

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize pre-rendered content
      await PrerenderedContent.initialize();

      // Start background preloading
      this.startBackgroundPreload();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize DataManager:', error);
      throw error;
    }
  }

  private async startBackgroundPreload(): Promise<void> {
    // Preload next 4 weeks in the background
    const today = new Date();
    for (let i = 7; i <= 28; i += 7) {
      const date = addDays(today, i);
      this.preloadQueue.push(format(date, 'yyyy-MM-dd'));
    }

    this.processPreloadQueue();
  }

  private async processPreloadQueue(): Promise<void> {
    while (this.preloadQueue.length > 0) {
      const date = this.preloadQueue.shift();
      if (date) {
        try {
          await PrerenderedContent.prerenderWeek(date);
          // Wait a bit before processing next item to avoid overwhelming the device
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Failed to prerender week:', error);
        }
      }
    }
  }

  async getMassProper(date: string = format(new Date(), 'yyyy-MM-dd')): Promise<MassProper> {
    try {
      // Try to get pre-rendered content first
      const prerendered = await PrerenderedContent.getDay(date);
      if (prerendered?.mass) {
        return prerendered.mass as unknown as MassProper;
      }

      // If not pre-rendered, generate on demand
      const dayInfo = LiturgicalCalendar.getDayInfo(date);
      return await LiturgicalTexts.getMassProper(dayInfo);
    } catch (error) {
      console.error('Failed to get Mass proper:', error);
      throw error;
    }
  }

  async getOfficeHour(hour: string, date: string = format(new Date(), 'yyyy-MM-dd')): Promise<OfficeHourProper> {
    try {
      // Try to get pre-rendered content first
      const prerendered = await PrerenderedContent.getDay(date);
      if (prerendered?.office) {
        return prerendered.office[hour.toLowerCase() as keyof typeof prerendered.office] as unknown as OfficeHourProper;
      }

      // If not pre-rendered, generate on demand
      const dayInfo = LiturgicalCalendar.getDayInfo(date);
      return await LiturgicalTexts.getOfficeHour(dayInfo, hour);
    } catch (error) {
      console.error('Failed to get Office hour:', error);
      throw error;
    }
  }

  async getDayInfo(date: string = format(new Date(), 'yyyy-MM-dd')): Promise<LiturgicalDay> {
    try {
      // Try to get pre-rendered content first
      const prerendered = await PrerenderedContent.getDay(date);
      if (prerendered?.metadata) {
        return {
          date,
          ...prerendered.metadata,
        } as LiturgicalDay;
      }

      // If not pre-rendered, generate on demand
      return LiturgicalCalendar.getDayInfo(date);
    } catch (error) {
      console.error('Failed to get day info:', error);
      throw error;
    }
  }

  async preloadDate(date: string): Promise<void> {
    if (!this.preloadQueue.includes(date)) {
      this.preloadQueue.push(date);
      this.processPreloadQueue();
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith('@sanctissimissa:prerendered:')
      );
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  getStorageUsage(): Promise<number> {
    // TODO: Implement storage usage calculation
    return Promise.resolve(0);
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance();