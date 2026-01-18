import { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Text } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isValid?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showValidation?: boolean;
}

export function FormInput({
  label,
  error,
  isValid,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showValidation = true,
  value,
  ...props
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;

  // Shake animation when error appears
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(errorOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const hasValue = value && value.length > 0;
  const showValidIcon = showValidation && isValid && hasValue && !error;
  const showErrorIcon = showValidation && error && hasValue;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
          isValid && hasValue && !error && styles.inputWrapperValid,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#F2330D' : '#9C5749'}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor="#9C5749"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Validation Icons */}
        {showValidIcon && (
          <View style={styles.validIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          </View>
        )}

        {showErrorIcon && (
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
          </View>
        )}

        {/* Custom Right Icon (like password toggle) */}
        {rightIcon && !showValidIcon && !showErrorIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconButton}>
            <Ionicons
              name={rightIcon}
              size={20}
              color="#9C5749"
            />
          </TouchableOpacity>
        )}

        {/* Password toggle when there's validation state */}
        {rightIcon && (showValidIcon || showErrorIcon) && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconButton}>
            <Ionicons
              name={rightIcon}
              size={20}
              color="#9C5749"
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Error Message */}
      <Animated.View style={[styles.errorContainer, { opacity: errorOpacity }]}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.errorText}> </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#1C100D',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8D3CE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputWrapperFocused: {
    borderColor: '#F2330D',
    shadowColor: '#F2330D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.02)',
  },
  inputWrapperValid: {
    borderColor: '#22C55E',
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'NotoSans_500Medium',
    color: '#1C100D',
    paddingVertical: 14,
  },
  validIcon: {
    marginLeft: 8,
  },
  errorIcon: {
    marginLeft: 8,
  },
  rightIconButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    minHeight: 20,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'NotoSans_500Medium',
    color: '#EF4444',
  },
});
