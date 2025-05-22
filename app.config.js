import 'dotenv/config';

export default {
  expo: {
    name: 'fake-bank',
    slug: 'fake-bank',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      bundleIdentifier: "com.mitschlagel.fakebank",
      supportsTablet: true
    },
    android: {
      package: "com.mitschlagel.fakebank",
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router'
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      awsUserPoolId: process.env.AWS_USER_POOL_ID,
      awsUserPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID,
      eas: {
        projectId: "008688bd-3084-4e5e-b40c-e7d6a12937a0"
      }
    }
  }
}; 