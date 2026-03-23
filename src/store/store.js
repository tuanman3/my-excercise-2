import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";

const store = configureStore({
  reducer: {
    profiles: profileReducer,
  },
});

store.subscribe(() => {
  const state = store.getState().profiles;

  localStorage.setItem("profiles", JSON.stringify(state.profiles));
  localStorage.setItem("selectedProfileId", state.selectedProfileId);
});

export default store;
