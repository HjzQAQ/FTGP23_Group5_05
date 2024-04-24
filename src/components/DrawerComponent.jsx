import React from 'react';
import { Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SendToMobileIcon from '@mui/icons-material/SendToMobile';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MoneyIcon from '@mui/icons-material/Money';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from '../features/toggleMenuSlice';
const DrawerComponent = () => {
  const dispatch = useDispatch();
  const menuState = useSelector(state => state.toggleMenu.menuState);
  return (
    <Drawer
      open={menuState}
      onClose={() => dispatch(toggle())}
      sx={{ '& .MuiDrawer-paper': { backgroundColor: '#240b36', width: '50%' } }}
    >
      <List sx={{ marginTop: 1, marginLeft: 1 }}>
        <ListItem button color="primary" component={Link} to="/">
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'white' }}>Home</ListItemText>
        </ListItem>
        <Divider sx={{ backgroundColor: '#ad5389', marginBottom: 2 }} />
        {/**Lend */}
        <ListItem button color="primary" component={Link} to="/lend">
          <ListItemIcon>
            <SendToMobileIcon color="primary" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'white' }}>Lend</ListItemText>
        </ListItem>
        {/**Borrow */}
        <ListItem button color="primary" component={Link} to="/borrow">
          <ListItemIcon>
            <MoneyIcon color="primary" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'white' }}>Borrow</ListItemText>
        </ListItem>
        {/**Stake */}
        <ListItem button color="primary" component={Link} to="/stake">
          <ListItemIcon>
            <MonetizationOnIcon color="primary" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'white' }}>Stake</ListItemText>
        </ListItem>
        {/**PayOff */}
        <ListItem button color="primary" component={Link} to="/payoff">
          <ListItemIcon>
            <AttachMoneyIcon color="primary" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'white' }}>PayOff</ListItemText>
        </ListItem>
        <Button variant="contained" sx={{ textTransform: 'capitalize', marginTop: 3 }}>
          Send / Receive
        </Button>
      </List>
    </Drawer>
  );
};

export default DrawerComponent;
