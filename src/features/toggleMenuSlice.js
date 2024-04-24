import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuState: false
};

export const toggleMenuSlice = createSlice({
  name: 'toggleMenu',
  initialState,
  reducers: {
    toggle: state => {
      state.menuState = !state.menuState;
    }
  }
});

// Action creators are generated for each case reducer function
export const { toggle } = toggleMenuSlice.actions;

export default toggleMenuSlice.reducer;
