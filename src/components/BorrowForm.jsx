import React, { useState } from 'react';
import { ethers } from 'ethers';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { maxValue } from '../features/MaxBorrow';
import {
  Container,
  Typography,
  TextField,
  Box,
  InputAdornment,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider
} from '@mui/material';
import { useSelector } from 'react-redux';
const BorrowForm = () => {
  const [day, setDay] = useState(false);
  const [interests, setInterests] = useState(false);
  const [value, setValue] = React.useState('ETH');
  const [collateral, setCollateral] = useState('');
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState(false);
  const address = useSelector(state => state.connectWallet.address);
  const lastCharacter = address.slice(-1);
  const output = Math.floor(300 + (580 - 300) * (lastCharacter.toString(10) / 9));
  const handleChange = event => {
    setValue(event.target.value);
  };

  const days = [
    { value: 0, label: '0' },
    { value: 1, label: '1 ' },
    { value: 2, label: '2 ' },
    { value: 3, label: '3 ' },
    { value: 4, label: '4 ' },
    { value: 5, label: '5 ' },
    { value: 6, label: '6 ' },
    { value: 7, label: '7 ' },
    { value: 8, label: '8 ' },
    { value: 9, label: '9 ' },
    { value: 10, label: '10 ' },
    { value: 11, label: '11 ' },
    { value: 12, label: '12 ' }
  ];
  const interest = [
    { value: 0, label: '0%' },
    { value: 10, label: '10%' },
    { value: 20, label: '20%' },
    { value: 30, label: '30%' },
    { value: 40, label: '40%' },
    { value: 50, label: '50%' }
  ];
  let prize;
  const handleSliderDayChange = (event, newValue) => {
    setDay(newValue);
  };
  const handleSliderInterestsChange = (event, newValue) => {
    setInterests(newValue);
  };

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));
  const createLoan = async e => {
    try {
      e.preventDefault();
      prize = ethers.utils.parseUnits(amount.toString(), 'ether');
      setProgress(true);
      //const usdEthAmount = await Number(amount * etherPrice).toFixed(2);
      const tx = await contract.createCryptoLoan(address, prize, day * 10, value, interests * 1000, {
        from: address,
        value: ethers.utils.parseEther(collateral)
      });
      tx.wait();
      setInterests(false);
      setDay(false);
      setCollateral('');
      setAmount('');
      setProgress(false);

      //console.log('sent');
    } catch (err) {
      console.error(err);
    }
  };
  const ProgressBar = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'black',
          zIndex: '1000',
          height: '70%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-50%',
          flexDirection: 'column',
          padding: 20,
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <CircularProgress />
        <Typography sx={{ color: 'white', marginTop: 4 }}>Transaction Loading...</Typography>
      </Box>
    );
  };
  const handleInputChange = event => {
    const newValue = event.target.value;
    if (newValue > 0.05) {
      setAmount(0.05);
    } else {
      setAmount(newValue);
    }
  };
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: '8px',
        paddingRight: '8px',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ width: '100%', marginTop: 5 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ color: '#240b36', marginBottom: 4 }}>
          Request crypto loan on Ethereum
        </Typography>
        <Typography variant="h5" gutterBottom align="left" sx={{ color: '#240b36', marginBottom: 4 }}>
          The credit score is {output}
        </Typography>
        <Typography variant="h5" gutterBottom align="left" sx={{ color: '#240b36', marginBottom: 4 }}>
          The max borrow value is 0.05
        </Typography>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 3
          }}
          onSubmit={createLoan}
        >
          <TextField
            required
            type="number"
            id="amount"
            label="Amount to borrow in ETH"
            color="primary"
            focused
            name="Amount"
            value={amount}
            // onChange={e => {
            //   setAmount(e.target.value);
            // }}
            onChange={e => {
              setAmount(e.target.value);
            }}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="start">ETH</InputAdornment>,
              inputProps: { min: 0.0, max: maxValue, step: '0.01' }
            }}
            sx={{ marginBottom: 3 }}
          />
          <Box mb={2} sx={{ width: '100%' }}>
            <Typography variant="h5">Total Loan Duration In Months</Typography>
            <Slider
              defaultValue={0}
              marks={days}
              step={0.5}
              min={0}
              max={12}
              onChangeCommitted={handleSliderDayChange}
            />
          </Box>
          <Box mb={2} sx={{ width: '100%' }}>
            <Typography variant="h5">Interest Percentage</Typography>
            <Slider
              defaultValue={0}
              marks={interest}
              step={0.001}
              min={0}
              max={50}
              onChangeCommitted={handleSliderInterestsChange}
            />
          </Box>
          <div style={{ width: '100%', marginBottom: 3 }}>
            {value === 'ETH' && (
              <TextField
                fullWidth
                required
                type="number"
                id="standard-multiline-static"
                label="ETH Collateral"
                color="primary"
                value={collateral}
                onChange={e => {
                  setCollateral(e.target.value);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                  inputProps: { min: 0.0, step: '0.01' }
                }}
                focused
              />
            )}
            <FormControl sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                row
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel value="ETH" control={<Radio size="small" color="secondary" />} label="ETH" />
                <FormControlLabel value="Lock Wallet" control={<Radio size="small" />} label="Lock Wallet" />
              </RadioGroup>
            </FormControl>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '100%'
            }}
          >
            <Button variant="contained" sx={{}} type="submit">
              Enter
            </Button>
          </div>
        </form>
      </Box>
      {progress && <ProgressBar />}
    </Container>
  );
};

export default BorrowForm;
