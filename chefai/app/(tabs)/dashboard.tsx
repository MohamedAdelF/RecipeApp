import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.headerBg}>
         <SafeAreaView edges={['top']} style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.userInfo}>
                <Image 
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI5ZI0BP8odImconSCMfakvcqiaiKphynbQvqB_iWM0wi7mLBMj7JsblnjqNSr8mC4ereQGckVt0lAYgHjIBBNTuEX6dyi3TkCeB4MzgGec3R8O_es4WHoh0NY9n0rEb30r2HvkNsbUJMTlw1N_gXeqpSbRIhX0fUZGglhpt3JS7PneubsEQ6N8PxDdx4Ish3lBoKq2nX6cffdWF14uPydXdPeXEy-gWGOJZivdvDwXVqci4s_sF2cWFH9n6KUNfp4cTooQcueE8E" }}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.welcomeText}>Welcome back,</Text>
                  <Text style={styles.userName}>Alex Johnson</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="notifications-none" size={26} color="#1c100d" />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>
         </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#f2330d" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search recipes or paste link..."
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
            <TouchableOpacity>
              <MaterialIcons name="mic" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card */}
        <TouchableOpacity style={styles.heroCard} onPress={() => router.push('/extracting')}>
          <LinearGradient
            colors={['rgba(242,51,13,0.05)', 'transparent']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <MaterialIcons name="smart-display" size={28} color="#f2330d" />
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Turn Video into Recipe</Text>
            <Text style={styles.heroSubtitle}>
              Paste a YouTube link to get ingredients and step-by-step instructions instantly using AI.
            </Text>
            <View style={styles.heroActions}>
              <View style={styles.pasteButton}>
                <MaterialIcons name="link" size={20} color="#FFF" />
                <Text style={styles.pasteButtonText}>Paste Link</Text>
              </View>
              <View style={styles.iconButtonSmall}>
                <MaterialIcons name="content-paste" size={24} color="#1c100d" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/scan')}>
            <View style={[styles.gridIcon, { backgroundColor: '#eff4e8' }]}>
              <MaterialIcons name="photo-camera" size={24} color="#556b2f" />
            </View>
            <Text style={styles.gridTitle}>Scan Fridge</Text>
            <Text style={styles.gridSubtitle}>Cook with what you have</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.gridIcon, { backgroundColor: '#fff7ed' }]}>
              <MaterialIcons name="bookmark" size={24} color="#ea580c" />
            </View>
            <Text style={styles.gridTitle}>Browse Saved</Text>
            <Text style={styles.gridSubtitle}>Your personal cookbook</Text>
          </TouchableOpacity>
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Saved</Text>
            <Text style={styles.seeAll}>View All</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {/* Card 1 */}
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.9}
              onPress={() => router.push('/recipe/1')}
            >
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5cL-wIM-1pHzKhIloJcErtUO2SGDqtjuExEFlvy6Uc5VslYNSZ8KmZwClkLeUJIhyQW5uO5dBXD6WU6OazO_d2bwUxW_f7yvZbE14nt7-0mFZo083rCbTwNRkJZZE4mCeIdD_7YSh4OaT77ICkd6B15SvpFZ7q9gCPbVwSyd_K_yTlE-8hlbSHiBiUHJrRMObWko5p4Ug33YaIaVynybnvhzHEPKnmlRWavMRqtZCXb8cXiNBJdRg1vmY1OKkETZ8WziSYNG3b9A" }}
                style={styles.cardImage}
              />
              <View style={styles.cardOverlay}>
                <View style={styles.timeBadge}>
                  <MaterialIcons name="schedule" size={12} color="#FFF" />
                  <Text style={styles.timeText}>15 min</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Spicy Tomato Basil Pasta</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>A quick and delicious pasta dish perfect for busy weeknights.</Text>
              </View>
            </TouchableOpacity>

            {/* Card 2 */}
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTreW6GHbV-QcRd-HNLcMbkamgg1j1VqUDUy-82pqzXgittl9NAi7Pj9sQDlT4247vbA8QValyUc_uNbtporY7GZ6X1EKU-irTYqwVOMvb-1UfGWQXkF76sVycRWhVpfTQk6z_qa6GiG_2KO5u7DjQXxiqY6n8Z-rq4Maeaf9UQSDGUoWj5h_n94Wm1dFkCykcs3sWLmow6ShnQSVhZ2rA2LHdDuC5WxGNAgpdixghVkM55Qr2BUEeIyqm5dhPJEpWjqgBTB7hxH0" }}
                style={styles.cardImage}
              />
              <View style={styles.cardOverlay}>
                <View style={styles.timeBadge}>
                  <MaterialIcons name="schedule" size={12} color="#FFF" />
                  <Text style={styles.timeText}>25 min</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Grilled Salmon & Avocado</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>Fresh, healthy, and packed with omega-3s.</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f6f5' },
  headerBg: { backgroundColor: 'rgba(248,246,245,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(242,51,13,0.1)' },
  welcomeText: { fontSize: 12, color: '#666', fontWeight: '500' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1c100d' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  badge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f2330d', position: 'absolute', top: 10, right: 10, borderWidth: 1, borderColor: '#FFF' },
  scrollContent: { paddingTop: 20 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  searchIcon: {},
  searchInput: { flex: 1, marginHorizontal: 12, fontSize: 16, color: '#1c100d' },
  heroCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 3, marginBottom: 20 },
  heroGradient: { position: 'absolute', top: 0, right: 0, width: 150, height: 150, borderBottomLeftRadius: 150 },
  heroContent: { padding: 20 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  heroIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(242,51,13,0.1)', alignItems: 'center', justifyContent: 'center' },
  newBadge: { backgroundColor: 'rgba(85,107,47,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  newBadgeText: { color: '#556b2f', fontSize: 10, fontWeight: 'bold' },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#1c100d', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 16 },
  heroActions: { flexDirection: 'row', gap: 12 },
  pasteButton: { flex: 1, height: 48, backgroundColor: '#f2330d', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pasteButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  iconButtonSmall: { width: 48, height: 48, backgroundColor: '#f8f6f5', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', paddingHorizontal: 20, gap: 16, marginBottom: 24 },
  gridItem: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  gridIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  gridTitle: { fontSize: 16, fontWeight: 'bold', color: '#1c100d', marginBottom: 4 },
  gridSubtitle: { fontSize: 12, color: '#666' },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1c100d' },
  seeAll: { color: '#f2330d', fontWeight: '600', fontSize: 14 },
  horizontalScroll: { paddingHorizontal: 20, gap: 16 },
  card: { width: 260, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardImage: { width: '100%', height: 160, backgroundColor: '#eee' },
  cardOverlay: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'flex-start' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, position: 'absolute', bottom: -130, left: 0 },
  timeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1c100d', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#666', lineHeight: 18 }
});