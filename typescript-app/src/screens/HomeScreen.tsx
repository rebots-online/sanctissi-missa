import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useAppTheme } from '../hooks/useAppTheme';
import { dataManager } from '../services/dataManager';
import { LiturgicalDay } from '../services/calendar';
import { Ionicons } from '@expo/vector-icons';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Home'>;

const HomeScreen: React.FC<Props> = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<Props['navigation']>();
  const [dayInfo, setDayInfo] = React.useState<LiturgicalDay | null>(null);

  React.useEffect(() => {
    loadDayInfo();
  }, []);

  const loadDayInfo = async () => {
    try {
      const info = await dataManager.getDayInfo();
      setDayInfo(info);
    } catch (error) {
      console.error('Failed to load day info:', error);
    }
  };

  const formatDate = (date: string = new Date().toISOString()) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  const navigateToOffice = (type: string) => {
    navigation.navigate('Office', { type });
  };

  const navigateToMass = () => {
    navigation.navigate('Mass');
  };

  if (!dayInfo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loading, { color: theme.colors.text }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
          {formatDate()}
        </Text>
        <Text style={[styles.celebration, { color: theme.colors.text }]}>
          {dayInfo.celebration || 'Feria'}
        </Text>
        <Text style={[styles.season, { color: theme.colors.textSecondary }]}>
          {dayInfo.season.replace('_', ' ').toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          DIVINE OFFICE
        </Text>
        <View style={styles.grid}>
          {['Matins', 'Lauds', 'Prime', 'Terce', 'Sext', 'None', 'Vespers', 'Compline'].map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[styles.gridItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigateToOffice(hour)}
            >
              <Ionicons 
                name="book-outline" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.gridItemText, { color: theme.colors.text }]}>
                {hour}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          HOLY MASS
        </Text>
        <TouchableOpacity
          style={[styles.massButton, { backgroundColor: theme.colors.surface }]}
          onPress={navigateToMass}
        >
          <Ionicons 
            name="heart-outline" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.massButtonText, { color: theme.colors.text }]}>
            Mass of the Day
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  celebration: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  season: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  massButton: {
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  massButtonText: {
    fontSize: 18,
    marginLeft: 12,
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default HomeScreen;