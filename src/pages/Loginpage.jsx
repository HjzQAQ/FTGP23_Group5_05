import { Button } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getAddress } from '../features/ConnectWalletSlice';
const Loginpage = () => {
  const dispatch = useDispatch();
  const connect = async () => {
    if (window.ethereum) {
      dispatch(getAddress());
    } else {
      alert('Please install MetaMask');
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#dddfd4'
      }}
    >
      <Button variant="contained" onClick={connect}>
        Connect With MetaMask
      </Button>
    </div>
  );
};

export default Loginpage;
