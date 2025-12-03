// Dynamic Expo config to wire Mapbox tokens from environment
// Loads RNMAPBOX_MAPS_DOWNLOAD_TOKEN for native build and exposes EXPO_PUBLIC_MAPBOX_TOKEN for JS
const fs = require('fs');
const path = require('path');

function loadDotEnv() {
  const envPath = path.join(__dirname, '.env');
  try {
    const txt = fs.readFileSync(envPath, 'utf8');
    txt.split('\n').forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) {
        const key = m[1];
        const val = m[2];
        if (!process.env[key]) process.env[key] = val;
      }
    });
  } catch (_) {
    // no .env, ignore
  }
}

module.exports = () => {
  loadDotEnv();

  const downloadToken = process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN;

  return {
    expo: {
      name: 'mapbox-app',
      slug: 'mapbox-app',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: 'mapboxapp',
      userInterfaceStyle: 'automatic',
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          backgroundColor: '#E6F4FE',
          foregroundImage: './assets/images/android-icon-foreground.png',
          backgroundImage: './assets/images/android-icon-background.png',
          monochromeImage: './assets/images/android-icon-monochrome.png',
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: 'com.barnesjack.mapboxapp',
      },
      web: {
        output: 'static',
        favicon: './assets/images/favicon.png',
      },
      plugins: [
        'expo-router',
        [
          'expo-splash-screen',
          {
            image: './assets/images/splash-icon.png',
            imageWidth: 200,
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
            dark: {
              backgroundColor: '#000000',
            },
          },
        ],
        [
          '@rnmapbox/maps',
          {
            RNMapboxMapsImpl: 'mapbox',
            // Deprecated, but ensures local builds work without relying on external env injection
            RNMapboxMapsDownloadToken: downloadToken,
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
        reactCompiler: true,
      },
      extra: {
        router: {},
        eas: {
          projectId: 'a62d87b0-849d-4400-aa3f-945769827c66',
        },
      },
    },
  };
};
