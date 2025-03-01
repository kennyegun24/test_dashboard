import { fetchUser } from "@/actions/fetchUser";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRoles = createAsyncThunk("fetchContent", async () => {
  const user = await fetchUser();
  const req = await axios.get(`${BACKEND_API_ROUTE}/roles`, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      userId: user?.userId,
    },
  });
  const data = await req.data;
  return data?.roles;
});

const initialState = {
  loading: true,
  roles: [],
  selectedRole: {},
  error: null,
};
const rolesSlice = createSlice({
  name: "allRoles",
  initialState: initialState,
  reducers: {
    selectRole(state, action) {
      state.selectedRole = action.payload;
    },
  },
  extraReducers(reducer) {
    reducer
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default rolesSlice.reducer;
export const { selectRole } = rolesSlice.actions;
