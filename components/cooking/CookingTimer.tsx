import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import type { CookingTimer as CookingTimerType } from '@/utils/types';

interface CookingTimerProps {
  timer: CookingTimerType;
  onComplete: () => void;
  onRemove: () => void;
}

export function CookingTimer({ timer, onComplete, onRemove }: CookingTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(timer.duration_seconds);

  useEffect(() => {
    if (!timer.is_active) return;

    const startTime = new Date(timer.started_at).getTime();
    const endTime = startTime + timer.duration_seconds * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.is_active, timer.started_at, timer.duration_seconds]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - remainingSeconds / timer.duration_seconds;
  const isUrgent = remainingSeconds <= 30;

  return (
    <View style={[styles.container, isUrgent && styles.containerUrgent]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Ionicons
            name="timer-outline"
            size={20}
            color={isUrgent ? '#F44336' : '#F2330D'}
          />
          <Text style={[styles.label, isUrgent && styles.labelUrgent]}>
            {timer.label}
          </Text>
        </View>
        <Text style={[styles.time, isUrgent && styles.timeUrgent]}>
          {formatTime(remainingSeconds)}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` },
            isUrgent && styles.progressFillUrgent,
          ]}
        />
      </View>

      <Button
        icon={<Ionicons name="close" size={18} color="#888" />}
        type="clear"
        onPress={onRemove}
        containerStyle={styles.removeButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8D3CE',
  },
  containerUrgent: {
    borderColor: '#F44336',
    backgroundColor: '#FFF5F5',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1C100D',
  },
  labelUrgent: {
    color: '#F44336',
  },
  time: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#F2330D',
    marginRight: 12,
  },
  timeUrgent: {
    color: '#F44336',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EFE6E2',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F2330D',
  },
  progressFillUrgent: {
    backgroundColor: '#F44336',
  },
  removeButton: {
    marginLeft: 8,
  },
});
