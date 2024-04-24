import { Box } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

const LendSections = ({ title, Icon }) => {
  return (
    <div>
      <NavLink
        to={`/lend/${title}`}
        variant="h5"
        style={({ isActive }) => {
          return {
            display: 'flex',
            alignItems: 'center',
            marginTop: 32,
            borderRadius: '33px',
            padding: 12,
            margin: 5,
            textTransform: 'capitalize',
            color: isActive ? '#240b36' : 'white',
            cursor: 'pointer',
            textDecoration: 'none',
            backgroundColor: isActive ? 'white' : 'transparent'
          };
        }}
      >
        <Box mr={5} sx={{ color: 'primary.main' }}>
          {Icon}
        </Box>
        {title}
      </NavLink>
    </div>
  );
};

export default LendSections;
