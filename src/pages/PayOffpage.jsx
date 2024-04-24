import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import Lender from '../components/Lender';
import Navbar from '../components/Navbar';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';

const PayOffpage = () => {
  const address = useSelector(state => state.connectWallet.address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));
  const [addressIsBorrower, setAddressIsBorrower] = useState(null);
  const [addressInfo, setAddressInfo] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [error, setError] = useState('');
  function createData(loanDuration, returnAmount, lender) {
    return {
      loanDuration,
      returnAmount,
      lender
    };
  }
  useEffect(() => {
    const getAllBorrowers = async () => {
      try {
        /*const cryptoBorrowersAddresses = */ await contract
          .cryptoBorrowers(address)
          .then(data =>
            setAddressInfo(
              createData(parseFloat(data[0]) / 10, Number(ethers.utils.formatEther(data[1])).toFixed(4), data[2])
            )
          );
        //.then(console.log(addressInfo));
        console.log(addressInfo);
      } catch (error) {
        //window.alert(error.errorArgs);
        setError(error.errorArgs);
        console.error('errormessage', error);
      }
    };
    getAllBorrowers();
  }, []);
  return (
    <div>
      <Navbar />
      <Box
        mt={2}
        sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
      >
        {addressInfo.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Box sx={{ width: '300px', backgroundColor: 'black', padding: 10, borderRadius: '30px' }}>
              <Typography sx={{ color: 'white' }} gutterBottom variant="h2">
                Error!!
              </Typography>
              <Typography sx={{ color: 'gray' }} variant="h6">
                {error}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Lender
            loanAmount={addressInfo.returnAmount}
            lender={addressInfo.lender}
            loanDuration={addressInfo.loanDuration}
          />
        )}
      </Box>
    </div>
  );
};

export default PayOffpage;
