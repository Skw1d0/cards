import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useCategoriesStore, Category } from "../stores/storeCategories";
import { useCallback } from "react";

export interface SyncDateType {
  syncTime: number | undefined;
  categories: Category[];
}

export const useFirestore = () => {
  const { categories } = useCategoriesStore();

  const upload = useCallback(async (): Promise<boolean> => {
    if (auth.currentUser?.uid === undefined) return false;

    const data: SyncDateType = {
      syncTime: Date.now(),
      categories: categories,
    };

    try {
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      await setDoc(userDocRef, data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [categories]);

  const download = useCallback(async (): Promise<SyncDateType | null> => {
    if (auth.currentUser?.uid === undefined) return null;
    try {
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const firestore = docSnapshot.data();
        return {
          syncTime: firestore.syncTime,
          categories: firestore.categories,
        };
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, []);

  return { upload, download };
};
