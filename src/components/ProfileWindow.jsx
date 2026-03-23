import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedProfile } from "../store/profileSlice";

const ProfileWindow = () => {
  const selectedProfile = useSelector(selectSelectedProfile);

  return (
    <div className="thx-window">
      <div className="sub-title flex">
        <h1 id="eqTitle" className="eq-title">
          {selectedProfile?.name || "Default"}
        </h1>
      </div>
    </div>
  );
};

export default ProfileWindow;
