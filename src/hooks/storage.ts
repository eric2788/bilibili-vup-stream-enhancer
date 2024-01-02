import { useStorage as useStorageApi } from "@plasmohq/storage/hook";
import { storage } from "~utils/storage";


type Setter<T> = ((v?: T, isHydrated?: boolean) => T) | T;

export const useStorage = <T extends object>(key: string, onInit?: Setter<T>) => useStorageApi<T>({key, instance: storage}, onInit)