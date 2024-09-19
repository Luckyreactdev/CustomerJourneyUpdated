import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import jobsReducer from "./jobsReducer";

const reducers = combineReducers({
  jobs: persistReducer(
    {
      key: "jobs",
      storage,
      keyPrefix: "datta-",
    },
    jobsReducer
  ),
  end_document: persistReducer(
    {
      key: "end_document",
      storage,
      keyPrefix: "datta-",
    },
    jobsReducer
  ),
  ed_field: persistReducer(
    {
      key: "ed_field",
      storage,
      keyPrefix: "datta-",
    },
    jobsReducer
  ),
  predecessor: persistReducer(
    {
      key: "predecessor",
      storage,
      keyPrefix: "datta-",
    },
    jobsReducer
  ),
  account: persistReducer(
    {
      key: "account",
      storage,
      keyPrefix: "datta-",
    },
    jobsReducer
  ),
});

export default reducers;
