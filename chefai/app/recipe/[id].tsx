import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f6f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <ImageBackground 
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaBXffYRpJodrH1Z5Aj8pIQIjwwx_30w-SeMyWMmbOJXon97eU8Z9XHl-exP2NBibx6KfcWQs56ZTCfjWmbMgtyj_s4p0Fv2Z5OkUGyQMgKshyu35eBWiUPJPvctVKiMMfh0u1ewIW6dgj1GYaQuYYKArWMf5mCeh8RekZQUV6QmXf7saB9RpzPaScwBMpYQpAGrmP6PR5QwtCfKbCT4FLshiqXpHJ7lGZpZPCYE8G0PDvqg09pcEmDLE19CwhLQui9OweGLTBy_o" }}
            style={styles.image}
          >
            <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient} />
            
            <SafeAreaView style={styles.topBar}>
              <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn}>
                <MaterialIcons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={styles.roundBtn}>
                  <MaterialIcons name="share" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundBtn}>
                  <MaterialIcons name="favorite-border" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>

            <View style={styles.heroContent}>
              <TouchableOpacity style={styles.playBtn}>
                 <MaterialIcons name="play-arrow" size={40} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.tags}>
                <View style={[styles.tag, { backgroundColor: '#f2330d' }]}>
                  <Text style={styles.tagText}>NEW</Text>
                </View>
                <BlurView intensity={30} style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={styles.tagText}>ITALIAN</Text>
                </BlurView>
              </View>
              <Text style={styles.title}>Spicy Tomato Basil Pasta</Text>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <MaterialIcons name="schedule" size={18} color="#ddd" />
                  <Text style={styles.statText}>25 min</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="bar-chart" size={18} color="#ddd" />
                  <Text style={styles.statText}>Medium</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="local-fire-department" size={18} color="#ddd" />
                  <Text style={styles.statText}>450 kcal</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* AI Tip */}
          <View style={styles.aiTip}>
             <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <MaterialIcons name="auto-awesome" size={20} color="#f2330d" />
                <Text style={{ fontWeight: 'bold', color: '#1c100d', textTransform: 'uppercase', fontSize: 12 }}>Chef's AI Tip</Text>
             </View>
             <Text style={{ color: '#666', lineHeight: 22, fontSize: 14 }}>This recipe uses the 'blooming' technique for spices found in the video at 02:14 to unlock deeper flavors.</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={{ color: '#666', fontSize: 14 }}>8 items</Text>
            </View>
            
            <View style={styles.servingToggle}>
              <Text style={styles.toggleText}>1 Serving</Text>
              <View style={styles.toggleActive}>
                <Text style={styles.toggleTextActive}>2 Servings</Text>
              </View>
              <Text style={styles.toggleText}>3 Servings</Text>
            </View>

            <View style={{ gap: 12, marginTop: 16 }}>
              {['Spaghetti (200g)', 'Garlic (3 cloves)', 'Tomatoes (4 units)', 'Olive Oil (1 tbsp)', 'Fresh Basil'].map((item, i) => (
                <View key={i} style={styles.ingredientRow}>
                  <View style={styles.checkbox} />
                  <Text style={styles.ingredientText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footerContainer}>
        <LinearGradient
          colors={['transparent', '#f8f6f5']}
          style={{ position: 'absolute', top: -30, left: 0, right: 0, height: 30 }}
        />
        <TouchableOpacity 
          style={styles.cookBtn}
          onPress={() => router.push('/cooking')}
        >
          <MaterialIcons name="soup-kitchen" size={24} color="#FFF" />
          <Text style={styles.cookBtnText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { height: 400, width: '100%', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  gradient: { ...StyleSheet.absoluteFillObject },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, alignItems: 'flex-start' },
  playBtn: { alignSelf: 'center', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  tags: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  tagText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF', marginBottom: 12, lineHeight: 38 },
  stats: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: '#ddd', fontSize: 13, fontWeight: '600' },
  content: { padding: 20, paddingTop: 30 },
  aiTip: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, shadowColor: 'orange', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: 'rgba(255,165,0,0.1)', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1c100d' },
  servingToggle: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4 },
  toggleText: { flex: 1, textAlign: 'center', paddingVertical: 8, fontSize: 13, color: '#666', fontWeight: '600' },
  toggleActive: { flex: 1, backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  toggleTextActive: { color: '#f2330d', fontWeight: 'bold', fontSize: 13 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#FFF', padding: 16, borderRadius: 16 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ddd' },
  ingredientText: { fontSize: 16, color: '#1c100d', fontWeight: '500' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f8f6f5', padding: 20, paddingBottom: 34 },
  cookBtn: { backgroundColor: '#f2330d', height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: '#f2330d', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  cookBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});