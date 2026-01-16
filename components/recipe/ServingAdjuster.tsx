import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@rneui/themed';
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
  const isScaled = servings !== originalServings;

  const decrease = () => {
    if (servings > 1) {
      onChange(servings - 1);
    }
  };

  const increase = () => {
    if (servings < 20) {
      onChange(servings + 1);
    }
  };

  const reset = () => {
    onChange(originalServings);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Ionicons name="people-outline" size={20} color="#666" />
          <Text style={styles.label}>Servings</Text>
        </View>

        <View style={styles.controls}>
          <Button
            icon={<Ionicons name="remove" size={20} color="#FF6B35" />}
            type="outline"
            buttonStyle={styles.button}
            onPress={decrease}
            disabled={servings <= 1}
          />
          <Text style={styles.value}>{servings}</Text>
          <Button
            icon={<Ionicons name="add" size={20} color="#FF6B35" />}
            type="outline"
            buttonStyle={styles.button}
            onPress={increase}
            disabled={servings >= 20}
          />
        </View>
      </View>

      {isScaled && (
        <View style={styles.scaleInfo}>
          <Text style={styles.scaleText}>
            Scaled from {originalServings} servings
          </Text>
          <Button
            title="Reset"
            type="clear"
            titleStyle={styles.resetText}
            onPress={reset}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#FF6B35',
    padding: 0,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    minWidth: 50,
    textAlign: 'center',
  },
  scaleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  scaleText: {
    fontSize: 13,
    color: '#888',
  },
  resetText: {
    color: '#FF6B35',
    fontSize: 13,
  },
});
