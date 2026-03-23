import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import ProfileDrawer from "./components/ProfileDrawer";
import ProfileWindow from "./components/ProfileWindow";

function App() {
  return (
    <Provider store={store}>
      <>
        <div className="main-container">
          <div className="thx-wrapper flex">
            <ProfileDrawer />
            <ProfileWindow />
          </div>
        </div>
      </>
    </Provider>
  );
}

export default App;
