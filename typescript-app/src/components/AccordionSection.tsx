import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface Props {
  title: string;
  latin: string;
  english: string;
  isExpanded: boolean;
  onPress: () => void;
}

const AccordionSection: React.FC<Props> = ({
  title,
  latin,
  english,
  isExpanded,
  onPress,
}) => {
  const theme = useAppTheme();

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isExpanded]);

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.content}>
          <Text style={[styles.latin, { color: theme.colors.text }]}>
            {latin}
          </Text>
          <Text style={[styles.english, { color: theme.colors.textSecondary }]}>
            {english}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  latin: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  english: {
    fontSize: 16,
  },
});

export default AccordionSection;