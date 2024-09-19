// action - state management

import { SAVE_TRACK_DATA } from "./actions/jobActions";
import { SAVE_END_DOCUMENT_DATA } from "./actions/jobActions";
import { SAVE_END_FIELD_DATA } from "./actions/jobActions";
import { SAVE_PREDECESSOR_DATA } from "./actions/jobActions";
import { SAVE_USER_DATA } from "./actions/jobActions";

export const initialState = {
  savedTrackData: null, // Add this line to initialize savedTrackData
  savedEndDocumentData: null, // Add this line to initialize savedTrackData
  savedEndFieldData: null, // Add this line to initialize savedTrackData
  savedPredecessorData: null, // Add this line to initialize savedTrackData
  savedUserData: null, // Add this line to initialize savedTrackData
};

//-----------------------|| JOBS REDUCER ||-----------------------//

const jobsReducer = (state = initialState, action) => {
  // console.log("Action:", action); // Log the action
  // console.log("Current State:", state); // Log the current state
  switch (action.type) {
    case SAVE_TRACK_DATA: {
      const data = action.payload;
      // Handle the data as needed and update the state
      return {
        ...state,
        savedTrackData: data,
      };
    }
    case SAVE_END_DOCUMENT_DATA: {
      const data = action.payload;
      // Handle the data as needed and update the state
      return {
        ...state,
        savedEndDocumentData: data,
      };
    }
    case SAVE_END_FIELD_DATA: {
      const data = action.payload;
      // Handle the data as needed and update the state
      return {
        ...state,
        savedEndFieldData: data,
      };
    }
    case SAVE_PREDECESSOR_DATA: {
      const data = action.payload;
      // Handle the data as needed and update the state
      return {
        ...state,
        savedPredecessorData: data,
      };
    }
    case SAVE_USER_DATA: {
      const data = action.payload;
      // Handle the data as needed and update the state
      return {
        ...state,
        savedUserData: data,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default jobsReducer;
