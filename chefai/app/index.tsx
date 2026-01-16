import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNwpqVSNoygmZGU1dn0NigHdJMkf0t7kohx-bdZuvCVvQBKrfjdmKefjlEYtuOe7Ds_Q7svOlKDB3RNn9bj5ptuULOF8HBPo7G9jtIhIQlT9zkjk30d_BbjvztcZSshhcTK0MMoLEK6qSncWDzTwXAfukZlaasBbiopKBT_sz7DMGUUpwDhNYnF-OBVmG1v9fDxTWOfx9hG1ETXQHFaQWO2squt_rtTnhnQ8sJee-WdYUtSOeOgAP3cdhQELsL2WMQGDXby7fkTWk",
    title: "Paste Any Video",
    description: "Found a delicious recipe on TikTok or YouTube? Just paste the link here."
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD565gA2Ncm_T8Z22LoaGuxjg562DcPCWs7sj0oO2e7o1dhqlsI3bxc0eqs4h7s4CIu1UbliX-3YV50uo5JhIfC57u8V0j_uogAf-1nuc6fJNthc70eeKDXf1BK2nbwtpU-noxKLRDS204iPvcguDrL3zO2dFSsM30dB12_ZPMPJG4G3Wi-xEJgOYc5F6vrbptpkK1u_vg_I0Mdn76rIro2qUXvpRIN5lLqlTko0Q9n4i3M_wZXxucFMNLqGPuME7lz6Sb97mEOhfY",
    title: "AI Magic Extraction",
    description: "Our AI instantly converts the video into a clear, step-by-step ingredient list."
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmx96cCafgddnO1TAmfng4FQnBCayWVuMy9-s0Av3isFqj4w06abyrl2Z8pJ9uU-fvlk-eEAMqwRKR_dxiCVUizr7R-5FuhoGi0h8OjwTIE6fYMcN8AuEf7RbQiqhqUS9FUwRd1Fa4Jrk3T7AkfFtJGWplLn543KmT67ndajrAUSyCQ_8d4-_8DGTno3HyvhveEyyJfVlLkJEvz8FyDWYQVYzs6fTgI-anPALG5bljgwXFUK25Z6guf-CfLIwjNjAYGeEFzr49oSM",
    title: "Cook Hands-Free",
    description: "Follow along with voice commands. No more touching your screen with messy hands."
  }
];

export default function Onboarding() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentSlide + 1), animated: true });
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.skipContainer}>
        <TouchableOpacity onPress={() => router.replace('/(auth)/welcome')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={{ width, alignItems: 'center', paddingTop: 60 }}>
            <View style={styles.imageContainer}>
               <ImageBackground source={{ uri: slide.image }} style={styles.image} imageStyle={{ borderRadius: 24 }}>
                 <LinearGradient colors={['transparent', 'rgba(0,0,0,0.1)']} style={styles.gradient} />
               </ImageBackground>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f5',
  },
  skipContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 24,
  },
  skipText: {
    color: '#f2330d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 40,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
  },
  textContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1c100d',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    alignItems: 'center',
    gap: 30,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 32,
    backgroundColor: '#f2330d',
  },
  dotInactive: {
    width: 10,
    backgroundColor: '#e2e8f0',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#f2330d',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#f2330d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});