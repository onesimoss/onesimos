const fs = require("fs");
const path = require("path");

const root = process.cwd();
const mobileDir = path.join(root, "mobile");

// 1. Clean App.tsx
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
    justifyContent: 'center',
    backgroundColor: '#FDFBF7',
  },
});
`;

fs.writeFileSync(path.join(mobileDir, "App.tsx"), appTsxContent, "utf8");
console.log("Updated mobile/App.tsx");

// 2. Write mobile/package.json
const mobilePackageJson = {
  name: "onesimos-mobile",
  version: "1.0.0",
  main: "node_modules/expo/AppEntry.js",
  scripts: {
    start: "expo start",
    android: "expo start --android",
    ios: "expo start --ios",
    web: "expo start --web"
  },
  dependencies: {
    expo: "~51.0.0",
    "expo-status-bar": "~1.12.1",
    react: "18.2.0",
    "react-native": "0.74.5",
    "react-native-webview": "13.8.6"
  },
  devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    typescript: "~5.3.3"
  },
  private: true
};

fs.writeFileSync(path.join(mobileDir, "package.json"), JSON.stringify(mobilePackageJson, null, 2), "utf8");
console.log("Created mobile/package.json");