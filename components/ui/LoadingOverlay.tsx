import React from 'react';
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Text } from '@rneui/themed';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});
