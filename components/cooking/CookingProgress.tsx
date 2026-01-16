import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';

interface CookingProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function CookingProgress({
  currentStep,
  totalSteps,
  progress,
}: CookingProgressProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.percentText}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 13,
    color: '#9C5749',
    fontFamily: 'NotoSans_500Medium',
  },
  percentText: {
    fontSize: 13,
    color: '#F2330D',
    fontFamily: 'NotoSans_600SemiBold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EFE6E2',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F2330D',
    borderRadius: 6,
  },
});
