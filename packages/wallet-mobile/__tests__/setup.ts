/**
 * Jest setup file.
 * Mocks native modules that are not available in the test environment.
 */

// Mock expo winter runtime modules that cause import scope issues in Jest
jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: { url: null },
}))
jest.mock('@ungap/structured-clone', () => ({
  __esModule: true,
  default: (obj: unknown) => JSON.parse(JSON.stringify(obj)),
}))


// Mock expo-crypto
jest.mock('expo-crypto', () => {
  let uuidCounter = 0
  return {
    digestStringAsync: jest.fn().mockResolvedValue('mocked-hash'),
    getRandomBytes: jest.fn().mockReturnValue(new Uint8Array(32)),
    getRandomBytesAsync: jest.fn().mockResolvedValue(new Uint8Array(32)),
    randomUUID: jest.fn(
      () => `00000000-0000-4000-8000-${(++uuidCounter).toString().padStart(12, '0')}`
    ),
    CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  }
})

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}))

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}))

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
  supportedAuthenticationTypesAsync: jest.fn().mockResolvedValue([1]),
  AuthenticationType: { FINGERPRINT: 1, FACIAL_RECOGNITION: 2, IRIS: 3 },
}))

// Mock expo-camera
jest.mock('expo-camera', () => ({
  Camera: { requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }) },
  CameraView: 'CameraView',
}))

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
}))

// Console silencing moved to setup-after-env.ts (setupFilesAfterEnv)
// because beforeAll/afterAll require the Jest test framework to be loaded.
