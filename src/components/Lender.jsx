import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';

const Lender = ({ loanDuration, loanAmount, lender }) => {
  const address = useSelector(state => state.connectWallet.address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));
  const pay = async () => {
    try {
      const tx = await contract.cryptoRepay(address, {
        value: ethers.utils.parseUnits(loanAmount.toString(), 'ether')
      });
      tx.wait();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Paper
      sx={{
        margin: '10px',
        marginLeft: 'auto',
        marginRight: 'auto',
        //backgroundColor: 'green',
        //width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        mr={2}
        p={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItem: 'center',
          //width: '100%',
          //backgroundColor: 'blue',
          justifyContent: 'space-between'
        }}
      >
        <Typography gutterBottom>{lender}</Typography>
        <Typography color="primary" gutterBottom>
          {loanAmount}ETH
        </Typography>
        <Typography color="primary" gutterBottom>
          {loanDuration * 30}days
        </Typography>
      </Box>
      <Button variant="contained" sx={{ marginRight: '15px' }} onClick={pay}>
        Pay
      </Button>
    </Paper>
  );
};

export default Lender;
