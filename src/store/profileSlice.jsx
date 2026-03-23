import { createSlice } from "@reduxjs/toolkit";

/* ===================== DEFAULT ===================== */

const DEFAULT_PROFILES = [
  { id: "default", name: "Default", type: "default", isDefault: true },
  { id: "game", name: "Game", type: "game", isDefault: true },
  { id: "movie", name: "Movie", type: "movie", isDefault: true },
  { id: "music", name: "Music", type: "music", isDefault: true },
  { id: "custom", name: "Custom", type: "custom", isDefault: false },
  {
    id: "demo",
    name: "Demo text ",
    type: "custom",
    isDefault: false,
  },
];

/* ===================== STORAGE ===================== */

const loadState = () => {
  try {
    const profiles = JSON.parse(localStorage.getItem("profiles"));
    const selectedProfileId = localStorage.getItem("selectedProfileId");

    if (profiles?.length) {
      return {
        profiles,
        selectedProfileId: selectedProfileId || profiles[0].id,
      };
    }
  } catch (e) {
    console.error("Load failed:", e);
  }

  return {
    profiles: DEFAULT_PROFILES,
    selectedProfileId: "default",
  };
};

const initialState = loadState();

/* ===================== SLICE ===================== */

const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    selectProfile: (state, action) => {
      state.selectedProfileId = action.payload;
    },

    addProfile: (state) => {
      const newProfile = {
        id: `custom_${Date.now()}`,
        name: "New Profile",
        type: "custom",
        isDefault: false,
      };

      state.profiles.push(newProfile);
      state.selectedProfileId = newProfile.id;
    },

    renameProfile: (state, action) => {
      const { id, name } = action.payload;
      const profile = state.profiles.find((p) => p.id === id);

      if (profile && name.trim()) {
        profile.name = name.trim();
      }
    },

    deleteProfile: (state, action) => {
      const id = action.payload;
      const index = state.profiles.findIndex((p) => p.id === id);

      if (index === -1) return;

      state.profiles.splice(index, 1);

      if (state.profiles.length === 0) {
        state.profiles = [...DEFAULT_PROFILES];
        state.selectedProfileId = "default";
      } else {
        const newIndex = Math.max(0, index - 1);
        state.selectedProfileId = state.profiles[newIndex].id;
      }
    },

    moveProfileUp: (state) => {
      const index = state.profiles.findIndex(
        (p) => p.id === state.selectedProfileId,
      );

      if (index > 0) {
        [state.profiles[index - 1], state.profiles[index]] = [
          state.profiles[index],
          state.profiles[index - 1],
        ];
      }
    },

    moveProfileDown: (state) => {
      const index = state.profiles.findIndex(
        (p) => p.id === state.selectedProfileId,
      );

      if (index < state.profiles.length - 1) {
        [state.profiles[index], state.profiles[index + 1]] = [
          state.profiles[index + 1],
          state.profiles[index],
        ];
      }
    },
  },
});

/* ===================== SELECTORS ===================== */

export const selectProfiles = (state) => state.profiles.profiles;

export const selectSelectedProfile = (state) =>
  state.profiles.profiles.find(
    (p) => p.id === state.profiles.selectedProfileId,
  );

/* ===================== EXPORT ===================== */

export const {
  selectProfile,
  addProfile,
  renameProfile,
  deleteProfile,
  moveProfileUp,
  moveProfileDown,
} = profileSlice.actions;

export default profileSlice.reducer;
