import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
const initialState = {
  walletConnected: false,
  address: '',
  status: null
};

export const getAddress = createAsyncThunk('address/getAddress', async (dispatch, getState) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return address;
});
export const connectWallet = createSlice({
  name: 'connectWallet',
  initialState,
  reducers: {
    changeAddress: (state, action) => {
      state.address = action.payload;
    }
  },
  extraReducers: {
    [getAddress.pending]: state => {
      state.status = 'loading';
    },
    [getAddress.fulfilled]: (state, action) => {
      state.status = 'success';
      state.address = action.payload;
      state.walletConnected = true;
    },
    [getAddress.rejected]: state => {
      state.status = 'failed';
    }
  }
});
export const { changeAddress } = connectWallet.actions;
export default connectWallet.reducer;
