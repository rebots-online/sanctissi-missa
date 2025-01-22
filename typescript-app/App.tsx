import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import { OfficeScreen, TabOfficeScreen } from './src/screens/OfficeScreen';
import { MassScreen, TabMassScreen } from './src/screens/MassScreen';
import { RootStackParamList, BottomTabParamList } from './src/navigation/types';
import { dataManager } from './src/services/dataManager';
import { useAppTheme } from './src/hooks/useAppTheme';
import { useNavigationTheme } from './src/navigation/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabNavigator() {
  const theme = useAppTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Office') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Mass') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Office" 
        component={TabOfficeScreen}
        options={{
          title: 'Divine Office',
        }}
      />
      <Tab.Screen 
        name="Mass" 
        component={TabMassScreen}
        options={{
          title: 'Holy Mass',
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const theme = useAppTheme();
  const navigationTheme = useNavigationTheme();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        await dataManager.initialize();
      } catch (error) {
        console.error('Failed to initialize data manager:', error);
      } finally {
        setInitializing(false);
      }
    }
    initialize();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ 
            headerShown: false,
            title: 'Sanctissi-Missa'
          }}
        />
        <Stack.Screen 
          name="Office" 
          component={OfficeScreen}
          options={({ route }) => ({ 
            title: route.params?.type || 'Divine Office',
          })}
        />
        <Stack.Screen 
          name="Mass" 
          component={MassScreen}
          options={{ 
            title: 'Holy Mass',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
