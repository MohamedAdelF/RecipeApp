import React, { useEffect } from 'react';
import { View, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { Text } from '@rneui/themed';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#F2330D',
  olive: '#606C38',
  oliveDark: '#283618',
  oliveLight: '#DDE5B6',
  backgroundLight: '#FCFAF9',
  backgroundDark: '#1A1210',
  cardLight: '#FFFFFF',
  cardDark: '#2A1D1A',
};

interface RecipeLoadingAnimationProps {
  ingredientCount: number;
  ingredientEmojis?: string[];
}

export function RecipeLoadingAnimation({
  ingredientCount,
  ingredientEmojis = ['🍅', '🥬', '🥚', '🧄'],
}: RecipeLoadingAnimationProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Animation values
  const orbitRotation = useSharedValue(0);
  const pulse1Scale = useSharedValue(1);
  const pulse1Opacity = useSharedValue(0.1);
  const pulse2Scale = useSharedValue(1);
  const pulse2Opacity = useSharedValue(0.05);
  const aiIconScale = useSharedValue(1);
  const dot1Y = useSharedValue(0);
  const dot2Y = useSharedValue(0);
  const dot3Y = useSharedValue(0);
  const progressX = useSharedValue(-1);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(20);

  useEffect(() => {
    // Orbit rotation - 12 seconds for full rotation
    orbitRotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );

    // Pulse animation 1
    pulse1Scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    pulse1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(0.1, { duration: 1500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );

    // Pulse animation 2 (delayed)
    pulse2Scale.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
    pulse2Opacity.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(0.02, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(0.05, { duration: 1500, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // AI Icon pulse
    aiIconScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Bouncing dots with stagger
    const dotAnimation = (delay: number) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-4, { duration: 300, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
          ),
          -1,
          false
        )
      );

    dot1Y.value = dotAnimation(0);
    dot2Y.value = dotAnimation(100);
    dot3Y.value = dotAnimation(200);

    // Progress bar animation
    progressX.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Fade in and slide up
    fadeIn.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
    slideUp.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
  }, []);

  // Animated styles
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitRotation.value}deg` }],
  }));

  const counterRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-orbitRotation.value}deg` }],
  }));

  const pulse1Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1Scale.value }],
    opacity: pulse1Opacity.value,
  }));

  const pulse2Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse2Scale.value }],
    opacity: pulse2Opacity.value,
  }));

  const aiIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: aiIconScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1Y.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2Y.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3Y.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progressX.value, [-1, 0, 1], [-192, 0, 192]) }],
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  // Get up to 4 emojis to display
  const displayEmojis = ingredientEmojis.slice(0, 4);
  while (displayEmojis.length < 4) {
    displayEmojis.push(['🍳', '🥗', '🍲', '🥘'][displayEmojis.length]);
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      {/* Orbit Container */}
      <View style={styles.orbitContainer}>
        {/* Pulsing Background Circles */}
        <Animated.View
          style={[
            styles.pulseCircle,
            styles.pulseCircle1,
            { backgroundColor: COLORS.primary },
            pulse1Style,
          ]}
        />
        <Animated.View
          style={[
            styles.pulseCircle,
            styles.pulseCircle2,
            { backgroundColor: COLORS.primary },
            pulse2Style,
          ]}
        />

        {/* Rotating Dashed Circle with Emoji Bubbles */}
        <Animated.View style={[styles.orbitRing, orbitStyle]}>
          {/* Dashed Border */}
          <View
            style={[
              styles.dashedBorder,
              { borderColor: isDark ? 'rgba(242,51,13,0.2)' : 'rgba(242,51,13,0.2)' },
            ]}
          />

          {/* Top Emoji */}
          <View style={[styles.emojiBubble, styles.emojiBubbleTop]}>
            <View
              style={[
                styles.emojiBubbleInner,
                {
                  backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Animated.Text style={[styles.emojiText, counterRotateStyle]}>
                {displayEmojis[0]}
              </Animated.Text>
            </View>
          </View>

          {/* Right Emoji */}
          <View style={[styles.emojiBubble, styles.emojiBubbleRight]}>
            <View
              style={[
                styles.emojiBubbleInner,
                {
                  backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Animated.Text style={[styles.emojiText, counterRotateStyle]}>
                {displayEmojis[1]}
              </Animated.Text>
            </View>
          </View>

          {/* Bottom Emoji */}
          <View style={[styles.emojiBubble, styles.emojiBubbleBottom]}>
            <View
              style={[
                styles.emojiBubbleInner,
                {
                  backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Animated.Text style={[styles.emojiText, counterRotateStyle]}>
                {displayEmojis[2]}
              </Animated.Text>
            </View>
          </View>

          {/* Left Emoji */}
          <View style={[styles.emojiBubble, styles.emojiBubbleLeft]}>
            <View
              style={[
                styles.emojiBubbleInner,
                {
                  backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Animated.Text style={[styles.emojiText, counterRotateStyle]}>
                {displayEmojis[3]}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        {/* Center Circle with AI Icon */}
        <View
          style={[
            styles.centerCircle,
            {
              backgroundColor: isDark ? COLORS.cardDark : COLORS.cardLight,
              shadowColor: COLORS.primary,
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : COLORS.cardLight,
            },
          ]}
        >
          <View style={styles.centerGradient} />
          <Animated.View style={[styles.aiIconContainer, aiIconStyle]}>
            <Ionicons name="sparkles" size={48} color={COLORS.primary} />
          </Animated.View>
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, dot1Style]} />
            <Animated.View style={[styles.dot, dot2Style]} />
            <Animated.View style={[styles.dot, dot3Style]} />
          </View>
        </View>
      </View>

      {/* Text Content */}
      <Animated.View style={[styles.textContainer, textContainerStyle]}>
        <Text
          style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : '#0F172A' },
          ]}
        >
          Chef AI is curating{'\n'}your menu...
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
          Matching{' '}
          <Text
            style={[
              styles.ingredientCount,
              {
                color: COLORS.primary,
                backgroundColor: isDark ? 'rgba(242,51,13,0.15)' : 'rgba(242,51,13,0.1)',
              },
            ]}
          >
            {' '}{ingredientCount} ingredients{' '}
          </Text>{' '}
          with recipes
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <Animated.View style={[styles.progressContainer, textContainerStyle]}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB' },
          ]}
        >
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </Animated.View>
    </View>
  );
}

const ORBIT_SIZE = 280;
const CENTER_SIZE = 120;
const EMOJI_BUBBLE_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  orbitContainer: {
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  pulseCircle: {
    position: 'absolute',
    borderRadius: ORBIT_SIZE / 2,
  },
  pulseCircle1: {
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
  },
  pulseCircle2: {
    width: ORBIT_SIZE - 96,
    height: ORBIT_SIZE - 96,
  },
  orbitRing: {
    position: 'absolute',
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedBorder: {
    position: 'absolute',
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
    borderRadius: ORBIT_SIZE / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emojiBubble: {
    position: 'absolute',
    width: EMOJI_BUBBLE_SIZE,
    height: EMOJI_BUBBLE_SIZE,
  },
  emojiBubbleInner: {
    width: EMOJI_BUBBLE_SIZE,
    height: EMOJI_BUBBLE_SIZE,
    borderRadius: EMOJI_BUBBLE_SIZE / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  emojiBubbleTop: {
    top: -EMOJI_BUBBLE_SIZE / 2,
    left: (ORBIT_SIZE - EMOJI_BUBBLE_SIZE) / 2,
  },
  emojiBubbleRight: {
    top: (ORBIT_SIZE - EMOJI_BUBBLE_SIZE) / 2,
    right: -EMOJI_BUBBLE_SIZE / 2,
  },
  emojiBubbleBottom: {
    bottom: -EMOJI_BUBBLE_SIZE / 2,
    left: (ORBIT_SIZE - EMOJI_BUBBLE_SIZE) / 2,
  },
  emojiBubbleLeft: {
    top: (ORBIT_SIZE - EMOJI_BUBBLE_SIZE) / 2,
    left: -EMOJI_BUBBLE_SIZE / 2,
  },
  emojiText: {
    fontSize: 24,
  },
  centerCircle: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 20,
    overflow: 'hidden',
  },
  centerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(242,51,13,0.05)',
  },
  aiIconContainer: {
    marginBottom: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  textContainer: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'NotoSans_500Medium',
    textAlign: 'center',
    lineHeight: 24,
  },
  ingredientCount: {
    fontFamily: 'PlusJakartaSans_700Bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressContainer: {
    marginTop: 48,
    width: 192,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});
