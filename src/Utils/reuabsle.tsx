import AsyncStorage from '@react-native-async-storage/async-storage';

export async function save(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
}

export async function remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
}
