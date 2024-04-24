import { Box, Button, Hidden, List, ListItem, ListItemText } from '@mui/material';
import React, { useEffect } from 'react';
import LendSections from '../components/LendSections';
import Navbar from '../components/Navbar';
import PaidIcon from '@mui/icons-material/Paid';
import HomeIcon from '@mui/icons-material/Home';
// import CarRentalIcon from '@mui/icons-material/CarRental';
// import CableIcon from '@mui/icons-material/Cable';
// import YardIcon from '@mui/icons-material/Yard';
// import BedroomParentIcon from '@mui/icons-material/BedroomParent';
// import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';

const Lendingpage = () => {
  const [category, setCategory] = React.useState('Crypto');
  const [isActive, setIsActive] = React.useState(false);
  const onClick = () => {
    setIsActive(!isActive);
  };

  let navigate = useNavigate();
  useEffect(() => {
    let isCancelled = true;
    if (isCancelled) {
      navigate('/lend/crypto');
    }
    return () => {
      isCancelled = false;
    };
  }, []);

  return (
    <div
      style={{
        height: '100%'
        /*backgroundColor: 'green'*/
      }}
    >
      <Navbar />
      <Hidden lgUp>
        <Button onClick={onClick} sx={{ border: '1px solid black', margin: 2 }}>
          {category}
          <KeyboardArrowDownIcon />
        </Button>
        <List
          sx={{
            display: `${isActive ? 'inline' : 'none'}`
          }}
        >
          <ListItem button color="#dddfd4" component={Link} to="/lend/crypto">
            <ListItemText
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Crypto
            </ListItemText>
          </ListItem>
          <ListItem button color="#dddfd4" component={Link} to="/lend/mortgage">
            <ListItemText
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Mortgage
            </ListItemText>
          </ListItem>
          {/* <ListItem button color="primary" component={Link} to="/lend/electronics">
            <ListItemText
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Electronics
            </ListItemText>
          </ListItem>
          <ListItem button color="primary" component={Link} to="/lend/automotive">
            <ListItemText
              //ref={dropdownRef}
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Automotive
            </ListItemText>
          </ListItem>
          <ListItem button color="primary" component={Link} to="/lend/gardening">
            <ListItemText
              //ref={dropdownRef}
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Gardening
            </ListItemText>
          </ListItem>
          <ListItem button color="primary" component={Link} to="/lend/CountryFinancialAid">
            <ListItemText
              //ref={dropdownRef}
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Country Financial Aid
            </ListItemText>
          </ListItem>
          <ListItem button color="primary" component={Link} to="/lend/household">
            <ListItemText
              //ref={dropdownRef}
              onClick={event => {
                setCategory(event.target.innerText);
                setIsActive(false);
              }}
            >
              Household
            </ListItemText>
          </ListItem> */}
        </List>
      </Hidden>
      <div
        style={{
          display: 'flex'
          /*backgroundColor: 'yellow' ,overflow: 'scroll'*/
        }}
      >
        <Hidden lgDown>
          <section
            style={{
              // flexBasis: '20%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#173e43',
              height: '100vh'
            }}
          >
            <Box sx={{ justifyContent: 'space-between', height: '100%', marginTop: 'auto' }}>
              <LendSections title="crypto" selected Icon={<PaidIcon />} />
              <LendSections title="mortgage" Icon={<HomeIcon />} />
              {/* <LendSections title="electronics" Icon={<CableIcon />} />
              <LendSections title="automotive" Icon={<CarRentalIcon />} />
              <LendSections title="gardening" Icon={<YardIcon />} />
              <LendSections title="CountryFinancialAid" Icon={<CreditCardIcon />} />
              <LendSections title="household" Icon={<BedroomParentIcon />} /> */}
            </Box>
          </section>
        </Hidden>
        <Outlet style={{ /*backgroundColor: 'blue', */ margin: 0 }} />
        {/*
        <div style={{ backgroundColor: 'blue', margin: 0 }}>
          <Outlet />
        </div>
          */}
      </div>
    </div>
  );
};

export default Lendingpage;
