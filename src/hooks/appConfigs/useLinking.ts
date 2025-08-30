import * as Linking from 'expo-linking';

export const useLinking = () => {
  return {
    linking: {
      prefixes: [Linking.createURL('/'), "black://", ""],
      config: {
        screens: {
          HomeScreen: 'home/:id',
        },
      },
    }
  };
}