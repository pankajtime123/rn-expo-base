import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
const storage = new MMKV();

// Type Definitions for the Utility Functions
type MMKVSetItem = (key: string, value: string | number | boolean) => void;
type MMKVGetItem = (key: string) => string | null | undefined;
type MMKVRemoveItem = (key: string) => void;
type MMKVClearAll = () => void;
type MMKVContainsKey = (key: string) => boolean;
type MMKVGetAllKeys = () => string[];
type MMKVGetBooleanItem = (key: string) => boolean | null | undefined;

// Utility functions
const mmkvSetItem: MMKVSetItem = (key, value) => {
  try {
    storage.set(key, value);
  } catch (error) {
    // console.error('Error setting item:',key, error);
  }
};

const mmkvGetItem: MMKVGetItem = (key) => {
  try {
    return storage.getString(key);
  } catch (error) {
    // console.error('Error getting item:', error);
    return null;
  }
};

const mmkvRemoveItem: MMKVRemoveItem = (key) => {
  try {
    storage.delete(key);
  } catch (error) {
    // console.error('Error removing item:', error);
  }
};

const mmkvClearAll: MMKVClearAll = () => {
  try {
    storage.clearAll();
  } catch (error) {
    // console.error('Error clearing all items:', error);
  }
};

const mmkvContainsKey: MMKVContainsKey = (key) => {
  try {
    return storage.contains(key);
  } catch (error) {
    // console.error('Error checking key existence:', error);
    return false;
  }
};

const mmkvGetAllKeys: MMKVGetAllKeys = () => {
  try {
    return storage.getAllKeys();
  } catch (error) {
    // console.error('Error getting all keys:', error);
    return [];
  }
};

// Function to get a boolean value
const mmkvGetBooleanItem: MMKVGetBooleanItem = (key) => {
  try {
    const value = storage.getString(key);
    if (value === 'true') {
      return true; // Convert string 'true' back to boolean true
    } else if (value === 'false') {
      return false; // Convert string 'false' back to boolean false
    }
    return null; // Return null if the key does not exist
  } catch (error) {
    // console.error('Error getting boolean item:', error);
    return null; // Return null in case of error
  }
};

// Export the utility functions
export default {
  mmkvSetItem,
  mmkvGetItem,
  mmkvGetBooleanItem,
  mmkvRemoveItem,
  mmkvClearAll,
  mmkvContainsKey,
  mmkvGetAllKeys,
};
