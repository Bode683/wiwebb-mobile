import {
  CardBrand,
  MobileMoneyProvider,
  NewPaymentMethodRequest,
  PaymentMethod,
  PaymentResult,
  Transaction
} from '../types';

/**
 * Mock payment methods
 */
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'credit_card',
    cardBrand: 'visa',
    lastFour: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    cardholderName: 'John Doe',
    isDefault: true,
    createdAt: '2025-10-15T10:30:00Z',
    updatedAt: '2025-10-15T10:30:00Z'
  },
  {
    id: 'pm_2',
    type: 'credit_card',
    cardBrand: 'mastercard',
    lastFour: '5555',
    expiryMonth: '06',
    expiryYear: '2026',
    cardholderName: 'John Doe',
    isDefault: false,
    createdAt: '2025-09-22T14:15:00Z',
    updatedAt: '2025-09-22T14:15:00Z'
  },
  {
    id: 'pm_3',
    type: 'paypal',
    email: 'john.doe@example.com',
    isDefault: false,
    createdAt: '2025-08-10T09:45:00Z',
    updatedAt: '2025-08-10T09:45:00Z'
  },
  {
    id: 'pm_4',
    type: 'google_pay',
    walletName: 'Google Pay',
    deviceName: 'Pixel 7',
    isDefault: false,
    createdAt: '2025-10-01T16:20:00Z',
    updatedAt: '2025-10-01T16:20:00Z'
  },
  {
    id: 'pm_5',
    type: 'samsung_pay',
    walletName: 'Samsung Pay',
    deviceName: 'Galaxy S23',
    isDefault: false,
    createdAt: '2025-09-15T11:30:00Z',
    updatedAt: '2025-09-15T11:30:00Z'
  },
  {
    id: 'pm_6',
    type: 'apple_pay',
    walletName: 'Apple Pay',
    deviceName: 'iPhone 14',
    isDefault: false,
    createdAt: '2025-09-10T13:45:00Z',
    updatedAt: '2025-09-10T13:45:00Z'
  },
  {
    id: 'pm_7',
    type: 'mobile_money',
    mobileMoneyProvider: 'orange_money',
    phoneNumber: '+237650123456',
    nickname: 'OM Personal',
    isDefault: false,
    createdAt: '2025-08-20T10:15:00Z',
    updatedAt: '2025-08-20T10:15:00Z'
  },
  {
    id: 'pm_8',
    type: 'mobile_money',
    mobileMoneyProvider: 'mtn_momo',
    phoneNumber: '+237670987654',
    nickname: 'MTN Business',
    isDefault: false,
    createdAt: '2025-08-18T09:30:00Z',
    updatedAt: '2025-08-18T09:30:00Z'
  }
];

/**
 * Mock transactions
 */
export const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    amount: 15.75,
    currency: 'USD',
    status: 'completed',
    paymentMethodId: 'pm_1',
    description: 'Premium WiFi Plan - 1 Month',
    createdAt: '2025-10-28T14:30:00Z',
    updatedAt: '2025-10-28T14:32:00Z',
    receiptUrl: 'https://receipts.example.com/tx_1'
  },
  {
    id: 'tx_2',
    amount: 8.50,
    currency: 'USD',
    status: 'completed',
    paymentMethodId: 'pm_1',
    description: 'WiFi Security Shield Add-on',
    createdAt: '2025-10-25T08:15:00Z',
    updatedAt: '2025-10-25T08:17:00Z',
    receiptUrl: 'https://receipts.example.com/tx_2'
  },
  {
    id: 'tx_3',
    amount: 12.30,
    currency: 'USD',
    status: 'refunded',
    paymentMethodId: 'pm_2',
    description: 'Standard WiFi Plan - 1 Month',
    createdAt: '2025-10-20T18:45:00Z',
    updatedAt: '2025-10-20T19:30:00Z',
    receiptUrl: 'https://receipts.example.com/tx_3'
  },
  {
    id: 'tx_4',
    amount: 22.40,
    currency: 'USD',
    status: 'failed',
    paymentMethodId: 'pm_2',
    description: 'Premium WiFi Plan - 3 Months',
    createdAt: '2025-10-15T22:10:00Z',
    updatedAt: '2025-10-15T22:11:00Z',
    failureReason: 'Insufficient funds'
  }
];

/**
 * Get all payment methods
 * 
 * @returns Promise with payment methods
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [...mockPaymentMethods];
}

/**
 * Get default payment method
 * 
 * @returns Promise with default payment method or null
 */
export async function getDefaultPaymentMethod(): Promise<PaymentMethod | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const defaultMethod = mockPaymentMethods.find(pm => pm.isDefault);
  return defaultMethod || null;
}

/**
 * Add a new payment method
 * 
 * @param paymentMethodRequest New payment method data
 * @returns Promise with created payment method
 */
export async function addPaymentMethod(
  paymentMethodRequest: NewPaymentMethodRequest
): Promise<PaymentMethod> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Validate card number (simple check for demo)
  if (paymentMethodRequest.type === 'credit_card' || paymentMethodRequest.type === 'debit_card' || paymentMethodRequest.type === 'stripe') {
    if (!paymentMethodRequest.cardNumber || paymentMethodRequest.cardNumber.length < 13) {
      throw new Error('Invalid card number');
    }

    if (!paymentMethodRequest.expiryMonth || !paymentMethodRequest.expiryYear || !paymentMethodRequest.cvc) {
      throw new Error('Missing required card information');
    }
  }

  // Validate mobile money
  if (paymentMethodRequest.type === 'mobile_money') {
    if (!paymentMethodRequest.mobileMoneyProvider) {
      throw new Error('Mobile money provider is required');
    }
    if (!paymentMethodRequest.phoneNumber) {
      throw new Error('Phone number is required');
    }
    if (!isValidPhoneNumber(paymentMethodRequest.phoneNumber)) {
      throw new Error('Invalid phone number format. Please use international format (e.g., +237650123456)');
    }
  }

  // Create new payment method
  const newPaymentMethod: PaymentMethod = {
    id: `pm_${Date.now()}`,
    type: paymentMethodRequest.type,
    isDefault: paymentMethodRequest.setAsDefault || false,
    nickname: paymentMethodRequest.nickname,
    displayOrder: mockPaymentMethods.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Add type-specific fields
  if (paymentMethodRequest.type === 'credit_card' || paymentMethodRequest.type === 'debit_card' || paymentMethodRequest.type === 'stripe') {
    newPaymentMethod.cardBrand = detectCardBrand(paymentMethodRequest.cardNumber!);
    newPaymentMethod.lastFour = paymentMethodRequest.cardNumber!.slice(-4);
    newPaymentMethod.expiryMonth = paymentMethodRequest.expiryMonth;
    newPaymentMethod.expiryYear = paymentMethodRequest.expiryYear;
    newPaymentMethod.cardholderName = paymentMethodRequest.cardholderName;

    // For Stripe, also add a mock stripe method ID
    if (paymentMethodRequest.type === 'stripe') {
      newPaymentMethod.stripeMethodId = `pm_stripe_${Date.now()}`;
    }
  }

  // Add mobile money fields
  if (paymentMethodRequest.type === 'mobile_money') {
    newPaymentMethod.mobileMoneyProvider = paymentMethodRequest.mobileMoneyProvider;
    newPaymentMethod.phoneNumber = paymentMethodRequest.phoneNumber;
  }

  // Add digital wallet fields
  if (paymentMethodRequest.type === 'apple_pay' || paymentMethodRequest.type === 'google_pay' || paymentMethodRequest.type === 'samsung_pay') {
    newPaymentMethod.walletName = paymentMethodRequest.type === 'apple_pay' ? 'Apple Pay' :
                                    paymentMethodRequest.type === 'google_pay' ? 'Google Pay' :
                                    'Samsung Pay';
    newPaymentMethod.deviceName = 'Current Device';
  }

  // Update default status if needed
  if (newPaymentMethod.isDefault) {
    for (const pm of mockPaymentMethods) {
      pm.isDefault = false;
    }
  }

  // Add to mock data
  mockPaymentMethods.push(newPaymentMethod);

  return newPaymentMethod;
}

/**
 * Set default payment method
 * 
 * @param paymentMethodId Payment method ID to set as default
 * @returns Promise with success status
 */
export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const methodIndex = mockPaymentMethods.findIndex(pm => pm.id === paymentMethodId);
  if (methodIndex === -1) {
    throw new Error('Payment method not found');
  }
  
  // Update default status
  for (const pm of mockPaymentMethods) {
    pm.isDefault = pm.id === paymentMethodId;
  }
  
  return true;
}

/**
 * Update payment method details (e.g., nickname)
 *
 * @param paymentMethodId Payment method ID to update
 * @param updates Partial payment method updates
 * @returns Promise with updated payment method
 */
export async function updatePaymentMethod(
  paymentMethodId: string,
  updates: Partial<Pick<PaymentMethod, 'nickname' | 'displayOrder'>>
): Promise<PaymentMethod> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const method = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
  if (!method) {
    throw new Error('Payment method not found');
  }

  // Apply updates
  if (updates.nickname !== undefined) {
    method.nickname = updates.nickname;
  }
  if (updates.displayOrder !== undefined) {
    method.displayOrder = updates.displayOrder;
  }

  method.updatedAt = new Date().toISOString();

  return method;
}

/**
 * Reorder payment methods
 *
 * @param orderedIds Array of payment method IDs in desired order
 * @returns Promise with success status
 */
export async function reorderPaymentMethods(orderedIds: string[]): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Update display order for all payment methods
  orderedIds.forEach((id, index) => {
    const method = mockPaymentMethods.find(pm => pm.id === id);
    if (method) {
      method.displayOrder = index;
      method.updatedAt = new Date().toISOString();
    }
  });

  return true;
}

/**
 * Delete payment method
 *
 * @param paymentMethodId Payment method ID to delete
 * @returns Promise with success status
 */
export async function deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const methodIndex = mockPaymentMethods.findIndex(pm => pm.id === paymentMethodId);
  if (methodIndex === -1) {
    throw new Error('Payment method not found');
  }
  
  // Check if it's the default payment method
  if (mockPaymentMethods[methodIndex].isDefault && mockPaymentMethods.length > 1) {
    // Find another payment method to set as default
    const newDefault = mockPaymentMethods.find(pm => pm.id !== paymentMethodId);
    if (newDefault) {
      newDefault.isDefault = true;
    }
  }
  
  // Remove from mock data
  mockPaymentMethods.splice(methodIndex, 1);
  
  return true;
}

/**
 * Get transaction history
 * 
 * @param limit Maximum number of transactions to return
 * @param offset Offset for pagination
 * @returns Promise with transactions
 */
export async function getTransactionHistory(
  limit: number = 10,
  offset: number = 0
): Promise<Transaction[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sort by date (newest first) and apply pagination
  const sortedTransactions = [...mockTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return sortedTransactions.slice(offset, offset + limit);
}

/**
 * Process payment
 *
 * @param amount Amount to charge
 * @param paymentMethodId Payment method ID to use
 * @param description Payment description
 * @returns Promise with payment result
 */
export async function processPayment(
  amount: number,
  paymentMethodId: string,
  description: string
): Promise<PaymentResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Find payment method
  const paymentMethod = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
  if (!paymentMethod) {
    return {
      success: false,
      error: 'Payment method not found'
    };
  }
  
  // Simulate random success/failure (90% success rate)
  const isSuccessful = Math.random() < 0.9;
  
  if (isSuccessful) {
    // Create transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      amount,
      currency: 'USD',
      status: 'completed',
      paymentMethodId,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      receiptUrl: `https://receipts.example.com/tx_${Date.now()}`
    };

    // Add to mock data
    mockTransactions.push(transaction);

    return {
      success: true,
      transactionId: transaction.id
    };
  } else {
    // Create failed transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      amount,
      currency: 'USD',
      status: 'failed',
      paymentMethodId,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failureReason: 'Payment declined by issuer'
    };

    // Add to mock data
    mockTransactions.push(transaction);

    return {
      success: false,
      transactionId: transaction.id,
      error: 'Payment declined by issuer'
    };
  }
}

/**
 * Helper function to detect card brand from number
 *
 * @param cardNumber Card number
 * @returns Card brand
 */
function detectCardBrand(cardNumber: string): CardBrand {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  // Visa: starts with 4
  if (cleanNumber.startsWith('4')) {
    return 'visa';
  }

  // Mastercard: 51-55, 2221-2720
  if (cleanNumber.startsWith('5')) {
    const firstTwo = parseInt(cleanNumber.substring(0, 2));
    if (firstTwo >= 51 && firstTwo <= 55) {
      return 'mastercard';
    }
  }
  if (cleanNumber.startsWith('2')) {
    const firstFour = parseInt(cleanNumber.substring(0, 4));
    if (firstFour >= 2221 && firstFour <= 2720) {
      return 'mastercard';
    }
  }

  // American Express: 34, 37
  if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) {
    return 'amex';
  }

  // Discover: 6011, 622126-622925, 644-649, 65
  if (cleanNumber.startsWith('6011') || cleanNumber.startsWith('65')) {
    return 'discover';
  }
  if (cleanNumber.startsWith('622')) {
    const firstSix = parseInt(cleanNumber.substring(0, 6));
    if (firstSix >= 622126 && firstSix <= 622925) {
      return 'discover';
    }
  }
  if (cleanNumber.startsWith('64')) {
    const firstThree = parseInt(cleanNumber.substring(0, 3));
    if (firstThree >= 644 && firstThree <= 649) {
      return 'discover';
    }
  }

  // Diners Club: 300-305, 36, 38
  if (cleanNumber.startsWith('36') || cleanNumber.startsWith('38')) {
    return 'diners';
  }
  if (cleanNumber.startsWith('30')) {
    const firstThree = parseInt(cleanNumber.substring(0, 3));
    if (firstThree >= 300 && firstThree <= 305) {
      return 'diners';
    }
  }

  // JCB: 3528-3589
  if (cleanNumber.startsWith('35')) {
    const firstFour = parseInt(cleanNumber.substring(0, 4));
    if (firstFour >= 3528 && firstFour <= 3589) {
      return 'jcb';
    }
  }

  // UnionPay: 62
  if (cleanNumber.startsWith('62')) {
    return 'unionpay';
  }

  return 'other';
}

/**
 * Helper function to validate phone number format
 *
 * @param phoneNumber Phone number to validate
 * @returns true if valid, false otherwise
 */
function isValidPhoneNumber(phoneNumber: string): boolean {
  // Basic validation for international phone numbers
  // Should start with + and have 10-15 digits
  const phoneRegex = /^\+[1-9]\d{9,14}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
}
