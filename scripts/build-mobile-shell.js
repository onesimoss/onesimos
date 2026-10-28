const fs = require("fs");
const path = require("path");

const root = process.cwd();

// 1. Write app.json
const appJson = {
  expo: {
    name: "Onesimos",
    slug: "onesimos",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./public/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./public/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FDFBF7"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.onesimos.mobile",
      infoPlist: {
        NSMicrophoneUsageDescription: "Onesimos requires microphone access to evaluate real-time oral reading accuracy and phonics pronunciation for children."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./public/adaptive-icon.png",
        backgroundColor: "#FDFBF7"
      },
      package: "app.onesimos.mobile",
      permissions: ["RECORD_AUDIO", "INTERNET", "MODIFY_AUDIO_SETTINGS"]
    },
    web: {
      favicon: "./public/favicon.ico"
    },
    extra: {
      eas: {
        projectId: "onesimos-app-mobile"
      }
    }
  }
};

fs.writeFileSync(path.join(root, "app.json"), JSON.stringify(appJson, null, 2), "utf8");
console.log("Successfully created app.json");

// 2. Write eas.json
const easJson = {
  cli: {
    version: ">= 10.0.0"
  },
  build: {
    development: {
      developmentClient: true,
      distribution: "internal"
    },
    preview: {
      distribution: "internal",
      android: {
        buildType: "apk"
      }
    },
    production: {
      android: {
        buildType: "app-bundle"
      },
      ios: {
        simulator: false
      }
    }
  },
  submit: {
    production: {}
  }
};

fs.writeFileSync(path.join(root, "eas.json"), JSON.stringify(easJson, null, 2), "utf8");
console.log("Successfully created eas.json");

// 3. Create mobile/App.tsx
const mobileDir = path.join(root, "mobile");
if (!fs.existsSync(mobileDir)) {
  fs.mkdirSync(mobileDir, { recursive: true });
}

const appTsxContent = `import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const PRODUCTION_URL = 'https://onesimos.app';

export default function App() {
  const webViewRef = useRef<WebView>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      <WebView
        ref={webViewRef}
        source={{ uri: PRODUCTION_URL }}
        style={styles.webview}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        )}
        onPermissionRequest={(event) => {
          event.grant();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justify.content: 'center',
    backgroundColor: '#FDFBF7',
  },
});
`;

fs.writeFileSync(path.join(mobileDir, "App.tsx"), appTsxContent, "utf8");
console.log("Successfully created mobile/App.tsx");