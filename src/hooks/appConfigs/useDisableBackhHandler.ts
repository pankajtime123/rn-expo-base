import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const useDisableBackHandler = (disable = true) => {
  useEffect(() => {
    const backAction = () => {
      if (disable) {
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => {
      subscription.remove();
    };
  }, [disable]);
};

export default useDisableBackHandler;
