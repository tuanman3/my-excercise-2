import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProfile,
  selectSelectedProfile,
  addProfile,
  renameProfile,
  deleteProfile,
  moveProfileUp,
  moveProfileDown,
} from "../store/profileSlice";

const ProfileDrawer = () => {
  const dispatch = useDispatch();
  const { profiles, selectedProfileId } = useSelector(
    (state) => state.profiles,
  );
  const [editingId, setEditingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const renameRef = useRef(null);

  const selectedProfile = useSelector(selectSelectedProfile);
  const selectedIndex = profiles.findIndex((p) => p.id === selectedProfileId);
  const isDefaultProfile = selectedProfile?.isDefault;
  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === profiles.length - 1;

  const handleRenameConfirm = useCallback(() => {
    const trimmed = renameValue.trim();
    if (trimmed && editingId) {
      dispatch(renameProfile({ id: editingId, name: trimmed }));
    }
    setEditingId(null);
    setRenameValue("");
  }, [dispatch, editingId, renameValue]);

  // CLICK HANDLERS
  const handleSafeClick = useCallback(
    (handler) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      handler();
    },
    [],
  );

  useEffect(() => {
    if (editingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingId && (e.key === "Enter" || e.key === "Escape")) {
        e.preventDefault();
        if (e.key === "Enter") handleRenameConfirm();
        else {
          setEditingId(null);
          setRenameValue("");
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingId, handleRenameConfirm]);

  return (
    <div className="thx-drawer flex">
      <div className="main-title">Profile List</div>
      <div id="profileWrapper" className="drawer-select flex">
        <div id="profileList" className="scrollable">
          {profiles.map((profile) => (
            <React.Fragment key={profile.id}>
              <div
                id={profile.id}
                className={`profile-item ${profile.type} 
                ${profile.id === selectedProfileId ? "active" : ""} 
                ${profile.isDefault ? "no-edit" : ""}
                ${editingId === profile.id ? "editing" : ""}`}
                onClick={handleSafeClick(() => {
                  dispatch(selectProfile(profile.id));
                  setEditingId(null);
                })}
              >
                {editingId === profile.id ? (
                  <input
                    id="profileRename"
                    ref={renameRef}
                    placeholder="Enter Profile Name"
                    maxLength={25}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={handleRenameConfirm}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleRenameConfirm();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setEditingId(null);
                        setRenameValue("");
                      }
                    }}
                  />
                ) : (
                  profile.name
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="toolbar flex">
          <div
            className="icon add"
            id="profileAdd"
            onClick={handleSafeClick(() => dispatch(addProfile()))}
            style={{ pointerEvents: "auto", cursor: "pointer" }}
          />

          {!isDefaultProfile && (
            <div
              className="icon edit show"
              id="profileEdit"
              onClick={handleSafeClick(() => {
                setEditingId(selectedProfileId);
                setRenameValue(selectedProfile.name);
              })}
              style={{ pointerEvents: "auto", cursor: "pointer" }}
            />
          )}

          {!isDefaultProfile && (
            <div
              className="icon delete show"
              id="profileDelete"
              onClick={handleSafeClick(() => setShowDeleteConfirm(true))}
              style={{ pointerEvents: "auto", cursor: "pointer" }}
            />
          )}

          <div
            className={`icon down ${isLast ? "disabled" : ""}`}
            id="profileDown"
            onClick={handleSafeClick(
              () => !isLast && dispatch(moveProfileDown()),
            )}
            style={{
              pointerEvents: "auto",
              cursor: isLast ? "default" : "pointer",
            }}
          />

          <div
            className={`icon up ${isFirst ? "disabled" : ""}`}
            id="profileUp"
            onClick={handleSafeClick(
              () => !isFirst && dispatch(moveProfileUp()),
            )}
            style={{
              pointerEvents: "auto",
              cursor: isFirst ? "default" : "pointer",
            }}
          />
        </div>

        <div
          id="profileDelCfm"
          className={`profile-del alert flex ${showDeleteConfirm ? "show" : ""}`}
        >
          <div className="title">delete eq</div>
          <div className="body-text t-center" id="delName">
            <strong>{selectedProfile?.name}</strong>
          </div>
          <div
            className="thx-btn"
            id="cfmDelete"
            onClick={handleSafeClick(() => {
              dispatch(deleteProfile(selectedProfileId));
              setShowDeleteConfirm(false);
            })}
            style={{ pointerEvents: "auto", cursor: "pointer" }}
          >
            delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
