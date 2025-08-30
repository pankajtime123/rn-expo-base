const versionNumber = "1.0.0";
const versionCode = 1


const environmentConfig = {
  development: {
    name: "Kadam Dev",
    baseURL: '',
    package: "com.base.dev",
    environment: "development",
  },
  production: {
    name: "Kadam",
    baseURL: '',
    package: 'com.base',
    environment: "production",
  }, 
  uat: {
    name: "Kadam",
    baseURL: '',
    package: 'com.base',
    environment: "uat",
  }
}

const environment = process.env.ENVIRONMENT || 'development'
const selectedEnvironment = environmentConfig[environment];

export default {
  expo: {
    splash: {
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    name: selectedEnvironment.name,
    slug: "base-rn",
    owner: "base",
    version: versionNumber,
    runtimeVersion: versionNumber,
    orientation: "portrait",
    icon: "./assets/images/adaptive-icon.png",
    scheme: "base",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    jsEngine: "hermes",
    ios: {
      newArchEnabled: true,
      supportsTablet: false,
      bundleIdentifier: selectedEnvironment.package,
      buildNumber: versionNumber,
     
    },
    android: {
      newArchEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
      },
      package: selectedEnvironment.package,
      versionCode,
      permissions: [
        "ACCESS_NETWORK_STATE",
      ],
     
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/adaptive-icon.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/adaptive-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true
          }
        }
      ],
      "expo-font",  
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      baseURL: selectedEnvironment.baseURL,
      environment: selectedEnvironment.environment,
    },
    backgroundColor: '#000000',
    updates: {
      url: selectedEnvironment.updateUrl,
      fallbackToCacheTimeout: 10000,
    },
  },

}