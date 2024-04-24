import React from 'react';
import { ethers } from 'ethers';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material';
import { create } from 'ipfs-http-client';
import { useSelector } from 'react-redux';
const client = create('https://ipfs.infura.io:5001/api/v0');

const BorrowItem = () => {
  const [location, setLocation] = React.useState('');
  const [day, setDay] = React.useState(false);
  const [collateral, setCollateral] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [item, setItem] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [fileUrl, updateFileUrl] = React.useState(``);
  const address = useSelector(state => state.connectWallet.address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));
  const days = [
    { value: 0, label: '0 ' },
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
  const handleSliderDayChange = (event, newValue) => {
    setDay(newValue);
  };
  const handleChange = event => {
    setCategory(event.target.value);
  };
  const createItemLoan = async e => {
    try {
      e.preventDefault();
      await contract.createItemLoan(
        address,
        category,
        item,
        location,
        description,
        day * 10,
        fileUrl,
        ethers.utils.parseEther(collateral),
        {
          from: address,
          value: ethers.utils.parseEther(collateral)
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
  const onChange = async e => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Container
      maxWidth="lg"
      sx={{ display: 'flex', justifyContent: 'center', paddingLeft: '8px', paddingRight: '8px' }}
    >
      <Box sx={{ width: '100%', marginTop: 5 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ color: '#240b36', marginBottom: 4 }}>
          Borrow an item on Ethereum
        </Typography>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 3
          }}
          onSubmit={createItemLoan}
        >
          <FormControl fullWidth sx={{ marginBottom: 3 }} color="primary" focused>
            <InputLabel id="docket">Category</InputLabel>
            <Select sx={{ width: '100%' }} labelId="category" label="Category" value={category} onChange={handleChange}>
              <MenuItem value="Mortgage">Mortgage</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Automotive">Automotive</MenuItem>
              <MenuItem value="Gardening">Gardening</MenuItem>
              <MenuItem value="Country Financial Aid">Country Financial Aid</MenuItem>
              <MenuItem value="Household">Household</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            type="text"
            id="item"
            label="What item do you want to borrow"
            color="primary"
            focused
            name="Item"
            value={item}
            onChange={e => {
              setItem(e.target.value);
            }}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            required
            type="text"
            id="location"
            label="Enter your location"
            color="primary"
            focused
            name="Location"
            value={location}
            onChange={e => {
              setLocation(e.target.value);
            }}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            required
            type="text"
            id="description"
            label="Enter item description"
            color="primary"
            focused
            name="Description"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            required
            type="file"
            id="image"
            label="Enter item image"
            color="primary"
            focused
            name="Image"
            onChange={onChange}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
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
            multiline
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '100%'
            }}
          >
            <Button variant="contained" sx={{}} type="submit">
              Submit
            </Button>
          </div>
        </form>
        {fileUrl && <img src={fileUrl} width="600px" />}
      </Box>
    </Container>
  );
};

export default BorrowItem;
