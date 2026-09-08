import adminAuthReducer from "./adminAuthSlice";
import adminContactReducer from "./adminContactSlice";
import adminOrdersReducer from "./adminOrdersSlice";
import adminUsersReducer from "./adminUsersSlice";
import { combineReducers } from "@reduxjs/toolkit";

/**
 * Admin Reducer Combiner
 * Combines all admin-related slices into a single admin namespace
 * This keeps admin state organized and separate from user state
 */
const adminReducer = combineReducers({
  auth: adminAuthReducer,
  orders: adminOrdersReducer,
  users: adminUsersReducer,
  contact: adminContactReducer,
});

export default adminReducer;
