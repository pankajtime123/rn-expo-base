
type RootStackParamsList = {
  Login: undefined;
  Otp: undefined;
  MainApp: undefined;
  WebViewScreen: { url: string };
  Referral: undefined;
  LanguageSelector: string | undefined;
  TestScreen: undefined;
  WelcomeScreen: undefined;
  ReferralRewardScreen: undefined;
  EventDetailsScreen: undefined;
  RoughScreen: undefined;
  SplashScreen: undefined;
  IntroScreen: undefined
  MainScreen: undefined
};

type RootStackParamList = keyof RootStackParamsList;

export const RootStackScreens: { [K in RootStackParamList]: K } = {
  Login: 'Login',
  Otp: 'Otp',
  MainApp: 'MainApp',
  WebViewScreen: 'WebViewScreen',
  Referral: 'Referral',
  LanguageSelector: 'LanguageSelector',
  TestScreen: 'TestScreen',
  WelcomeScreen: 'WelcomeScreen',
  ReferralRewardScreen: 'ReferralRewardScreen',
  EventDetailsScreen: 'EventDetailsScreen',
  RoughScreen: 'RoughScreen',
  SplashScreen: 'SplashScreen',
  IntroScreen: 'IntroScreen', 
  MainScreen: 'MainScreen'
};