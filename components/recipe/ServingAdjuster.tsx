import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

interface ServingAdjusterProps {
  servings: number;
  originalServings: number;
  onChange: (newServings: number) => void;
}

export function ServingAdjuster({
  servings,
  originalServings,
  onChange,
}: ServingAdjusterProps) {
  const decrease = () => {
    if (servings > 1) onChange(servings - 1);
  };

  const increase = () => {
    if (servings < 20) onChange(servings + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Ionicons name="restaurant-outline" size={22} color="#666" />
        <Text style={styles.label}>Servings</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.buttonMinus]}
          onPress={decrease}
          disabled={servings <= 1}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={20} color={servings <= 1 ? '#CCC' : '#666'} />
        </TouchableOpacity>

        <Text style={styles.value}>{servings}</Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonPlus]}
          onPress={increase}
          disabled={servings >= 20}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={servings >= 20 ? '#CCC' : '#F2330D'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F6F5',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'NotoSans_500Medium',
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMinus: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  buttonPlus: {
    borderColor: 'rgba(242, 51, 13, 0.3)',
    backgroundColor: 'rgba(242, 51, 13, 0.08)',
  },
  value: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1C100D',
    minWidth: 32,
    textAlign: 'center',
  },
});
