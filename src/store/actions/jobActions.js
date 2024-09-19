export const SAVE_TRACK_DATA = "SAVE_TRACK_DATA";
export const SAVE_END_DOCUMENT_DATA = "SAVE_END_DOCUMENT_DATA";
export const SAVE_END_FIELD_DATA = "SAVE_END_FIELD_DATA";
export const SAVE_PREDECESSOR_DATA = "SAVE_PREDECESSOR_DATA";
export const SAVE_USER_DATA = "SAVE_USER_DATA";

export const saveTrackData = (data) => ({
  type: SAVE_TRACK_DATA,
  payload: data,
});
export const saveEndDocumentData = (data) => ({
  type: SAVE_END_DOCUMENT_DATA,
  payload: data,
});
export const saveEndFieldData = (data) => ({
  type: SAVE_END_FIELD_DATA,
  payload: data,
});
export const savePredecessorData = (data) => ({
  type: SAVE_PREDECESSOR_DATA,
  payload: data,
});
export const saveUserData = (data) => ({
  type: SAVE_USER_DATA,
  payload: data,
});
