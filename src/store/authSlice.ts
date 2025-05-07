import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface Admin {
  id: string;
  email: string;
}

interface AuthState {
  user: Admin | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

// POST /cms/login
export const login = createAsyncThunk<
  Admin,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (creds, thunkAPI) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cms/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(creds),
  });
  if (!res.ok) return thunkAPI.rejectWithValue("Login failed");
  return (await res.json()) as Admin;
});

// GET /cms/admin
export const fetchAdmin = createAsyncThunk<
  Admin,
  void,
  { rejectValue: string }
>("auth/fetchAdmin", async (_, thunkAPI) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cms/admin`, {
    credentials: "include",
  });
  if (!res.ok) return thunkAPI.rejectWithValue("Not authenticated");
  return (await res.json()) as Admin;
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error";
      })
      // fetchAdmin
      .addCase(fetchAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchAdmin.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
