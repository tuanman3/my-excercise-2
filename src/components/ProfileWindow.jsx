import React from "react";
import { useSelector } from "react-redux";

const ProfileWindow = () => {
  const selectedProfile = useSelector((state) =>
    state.profiles.profiles.find(
      (p) => p.id === state.profiles.selectedProfileId,
    ),
  );

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
