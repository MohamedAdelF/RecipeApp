import { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { aiService } from '@/services/ai.service';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FridgeScanResults } from '@/components/recipe/FridgeScanResults';
import type { FridgeScanResult, SuggestedRecipe } from '@/utils/types';

export default function FridgeScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<FridgeScanResult | null>(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState<SuggestedRecipe[]>([]);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      if (photo?.base64) {
        setCapturedImage(photo.uri);
        await analyzeImage(photo.base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setCapturedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeImage = async (base64: string) => {
    try {
      setIsLoading(true);
      setLoadingMessage('Analyzing your fridge...');

      const result = await aiService.analyzeFridgeImage(base64);
      setScanResult(result);

      if (result.ingredients.length > 0) {
        setLoadingMessage('Finding recipes you can make...');

        const ingredientNames = result.ingredients.map((i) => i.name);
        const recipes = await aiService.suggestRecipesFromIngredients(ingredientNames);
        setSuggestedRecipes(recipes);
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to analyze image');
      setCapturedImage(null);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setScanResult(null);
    setSuggestedRecipes([]);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#C8B7B2" />
        <Text h4 style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to scan your fridge and identify ingredients
        </Text>
        <Button
          title="Grant Permission"
          onPress={requestPermission}
          buttonStyle={styles.permissionButton}
          titleStyle={styles.permissionButtonText}
        />
        <Button
          title="Choose from Gallery"
          type="outline"
          onPress={pickImage}
          buttonStyle={styles.galleryButton}
          titleStyle={styles.galleryButtonText}
        />
      </View>
    );
  }

  if (scanResult) {
    return (
      <FridgeScanResults
        scanResult={scanResult}
        suggestedRecipes={suggestedRecipes}
        onReset={handleReset}
        onSelectRecipe={(recipe) => {
          // TODO: Create recipe from suggestion
          router.back();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message={loadingMessage} />

      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={styles.previewActions}>
            <Button
              title="Retake"
              type="outline"
              onPress={handleReset}
              buttonStyle={styles.retakeButton}
              titleStyle={styles.retakeButtonText}
            />
          </View>
        </View>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.topBar}>
                <Button
                  icon={<Ionicons name="chevron-back" size={22} color="#FFF" />}
                  type="clear"
                  onPress={() => router.back()}
                  containerStyle={styles.topButton}
                />
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Scanning</Text>
                </View>
                <Button
                  icon={<Ionicons name="images" size={22} color="#FFF" />}
                  type="clear"
                  onPress={pickImage}
                  containerStyle={styles.topButton}
                />
              </View>

              <View style={styles.frameWrap}>
                <View style={styles.scanFrame} />
                <View style={styles.scanFrameGlow} />
              </View>

              <Text style={styles.scanText}>
                Position your fridge or pantry in the frame
              </Text>
            </View>
          </CameraView>

          <View style={styles.controls}>
            <Button
              icon={<Ionicons name="images" size={24} color="#FFF" />}
              type="clear"
              onPress={pickImage}
              containerStyle={styles.controlButton}
            />
            <Button
              icon={<Ionicons name="camera" size={32} color="#FFF" />}
              onPress={takePicture}
              buttonStyle={styles.captureButton}
            />
            <View style={styles.controlButton} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F6F5',
  },
  permissionTitle: {
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    color: '#1C100D',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  permissionText: {
    textAlign: 'center',
    color: '#9C5749',
    marginBottom: 32,
    lineHeight: 22,
    fontFamily: 'NotoSans_500Medium',
  },
  permissionButton: {
    backgroundColor: '#F2330D',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 16,
  },
  permissionButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  galleryButton: {
    borderColor: '#F2330D',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  galleryButtonText: {
    color: '#F2330D',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 20,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3DDC84',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'NotoSans_600SemiBold',
  },
  frameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 280,
    height: 350,
    borderWidth: 2,
    borderColor: 'rgba(242,51,13,0.8)',
    borderRadius: 18,
    backgroundColor: 'rgba(242,51,13,0.08)',
  },
  scanFrameGlow: {
    position: 'absolute',
    width: 300,
    height: 370,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(242,51,13,0.2)',
  },
  scanText: {
    color: '#FFF',
    marginTop: 24,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'NotoSans_500Medium',
    paddingHorizontal: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 42,
    backgroundColor: '#110A08',
  },
  controlButton: {
    width: 60,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F2330D',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  previewActions: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  retakeButton: {
    borderColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
