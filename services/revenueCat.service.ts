import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const APPLE_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || '';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || '';

class RevenueCatService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const apiKey = Platform.OS === 'ios' ? APPLE_API_KEY : GOOGLE_API_KEY;

      if (!apiKey) {
        console.warn('RevenueCat API key not configured');
        return;
      }

      Purchases.configure({ apiKey });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
    }
  }

  async login(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
    } catch (error) {
      console.error('RevenueCat login failed:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
    } catch (error) {
      console.error('RevenueCat logout failed:', error);
    }
  }

  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

  async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return this.checkPremiumStatus(customerInfo);
    } catch (error: any) {
      if (error.userCancelled) {
        return false;
      }
      throw error;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return this.checkPremiumStatus(customerInfo);
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  async isPremium(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.checkPremiumStatus(customerInfo);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }

  private checkPremiumStatus(customerInfo: CustomerInfo): boolean {
    // Check if user has active "pro" entitlement
    return (
      customerInfo.entitlements.active['pro'] !== undefined ||
      customerInfo.entitlements.active['premium'] !== undefined
    );
  }
}

export const revenueCatService = new RevenueCatService();
export default RevenueCatService;
