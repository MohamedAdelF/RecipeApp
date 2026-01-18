import { StyleSheet, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { Text } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'outline' && styles.buttonOutline,
    isDisabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.textPrimary,
    variant === 'secondary' && styles.textSecondary,
    variant === 'outline' && styles.textOutline,
    isDisabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#F2330D'}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={variant === 'primary' ? '#FFFFFF' : '#F2330D'}
              style={styles.icon}
            />
          )}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: '#F2330D',
    shadowColor: '#F2330D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(242, 51, 13, 0.1)',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E8D3CE',
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  text: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#F2330D',
  },
  textOutline: {
    color: '#1C100D',
  },
  textDisabled: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 4,
  },
});
