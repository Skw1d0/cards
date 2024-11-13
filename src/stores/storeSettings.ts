import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SettingsActions {
  toggleDarkMode: () => void;
}

export interface SettingsState {
  isDarkMode: boolean;
}

const initialState: SettingsState = {
  isDarkMode: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleDarkMode: () => {
        const { isDarkMode: darkMode } = get();
        set({ isDarkMode: !darkMode });
      },
    }),
    {
      name: "cards-settings-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
