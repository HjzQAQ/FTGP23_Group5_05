import React from 'react';
import Navbar from '../components/Navbar';
import BorrowForm from '../components/BorrowForm';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import BorrowItem from '../components/BorrowItem';
//import { Container } from '@mui/material';
//import { Divider } from '@mui/material';
//import LendersList from '../components/LendersList';

const Borrowpage = () => {
  const [selectedTab, setSelectedTab] = React.useState('1');
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <>
      <Navbar />

      <TabContext value={selectedTab}>
        <TabList
          onChange={handleChange}
          variant={'fullWidth'}
          scrollButtons={false}
          sx={{ backgroundColor: '#92E4ED' }}
        >
          <Tab
            label="Borrow Crypto"
            value="1"
            sx={{ fontWeight: 700, color: '#11131E33', '&.Mui-selected': { color: '#254043' } }}
          />
          <Tab
            label="Borrow Item"
            value="2"
            sx={{ fontWeight: 700, color: '#11131E33', '&.Mui-selected': { color: '#254043' } }}
          />
        </TabList>
        <TabPanel value="1">
          <BorrowForm />
        </TabPanel>
        <TabPanel value="2">
          <BorrowItem />
        </TabPanel>
      </TabContext>
    </>
  );
};

export default Borrowpage;
