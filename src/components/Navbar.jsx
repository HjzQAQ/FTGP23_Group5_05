import React, { useEffect } from 'react';
import { AppBar, Box, Container, Hidden, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from '../features/toggleMenuSlice';
import DrawerComponent from './DrawerComponent';
import { changeAddress } from '../features/ConnectWalletSlice';
const Navbar = () => {
  const dispatch = useDispatch();
  const address = useSelector(state => state.connectWallet.address);
  const navLinkStyles = ({ isActive }) => {
    return {
      fontSize: '1.125rem',
      padding: 12,
      color: isActive ? '#dddfd4' : 'white',
      fontWeight: isActive ? 800 : 600,
      textDecoration: isActive ? 'underline' : 'none'
    };
  };
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', a => {
        //window.location.reload();
        dispatch(changeAddress(a[0]));
      });
    }
  }, []);
  return (
    <AppBar position="sticky" elevation={1} sx={{ background: '#173e43' }}>
      <Container maxWidth="lg" sx={{ paddingLeft: 0, paddingRight: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/**MenuIcon */}
            <Hidden mdUp>
              <IconButton
                onClick={() => {
                  dispatch(toggle());
                }}
              >
                <MenuIcon sx={{ color: 'white' }} fontSize="large" />
              </IconButton>
            </Hidden>
            {/**Logo */}
            <Hidden mdDown>
              <Typography variant="h5" color="#dddfd4">
                Lending Platform
              </Typography>
              {/* <NavLink to="/">
                <h1>Lending Platform</h1>
              </NavLink> */}
            </Hidden>
          </Box>
          {/**Menu-items */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Hidden mdDown>
              <NavLink to="/" style={navLinkStyles}>
                Home
              </NavLink>
              <NavLink to="/lend" style={navLinkStyles}>
                Lend
              </NavLink>
              <NavLink to="/borrow" style={navLinkStyles}>
                Borrow
              </NavLink>
              <NavLink to="/payoff" style={navLinkStyles}>
                PayOff
              </NavLink>
              <NavLink to="/new" style={navLinkStyles}>
                New
              </NavLink>
              {/*<NavLink to="/stake" style={navLinkStyles}>
                Stake
              </NavLink>
              <NavLink to="/market" style={navLinkStyles}>
                Market
              </NavLink>*/}
            </Hidden>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" align="center" color="#dddfd4">
              Wallet Connected
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 900 }} align="center" color="gray">
              {address.slice(0, 4)}...
              {address.slice(35)}
            </Typography>
          </Box>
        </Toolbar>
        <DrawerComponent />
      </Container>
    </AppBar>
  );
};

export default Navbar;
