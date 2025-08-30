import * as SecureStore from "expo-secure-store";

const IS_BROWSER =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

export const saveSecureItem = (key: string, value: string) => {
  if (IS_BROWSER) {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
  if (SecureStore?.setItemAsync) {
    console.log('Saving secure item: key', key);
    console.log('Saving secure item: value', value);
    return SecureStore.setItemAsync(key, value);
  }
  return Promise.reject("Unidentified environment");
};

export const getSecureItem = async (key: string) => {
  if (IS_BROWSER) {
    return localStorage.getItem(key);
  }
  if (SecureStore?.getItemAsync) {
    return await SecureStore.getItemAsync(key);
  }
  return Promise.reject("Unidentified environment");
};

export const removeSecureItem = (key: string) => {
  if (IS_BROWSER) {
    return localStorage.removeItem(key);
  }
  if (SecureStore?.deleteItemAsync) {
    return SecureStore.deleteItemAsync(key);
  }
  return Promise.reject("Unidentified environment");
};
