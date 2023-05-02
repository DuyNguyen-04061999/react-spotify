import { createSlice } from "@reduxjs/toolkit";

const cacheSlice = createSlice({
  name: "cache",
  initialState: {},
  reducers: {
    setCache: (state, { payload: { name, data } = {} }) => ({
      ...state,
      [name]: data,
    }),
  },
});

export const { setCache } = cacheSlice.actions;
export default cacheSlice.reducer;
