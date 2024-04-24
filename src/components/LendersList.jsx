import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { tableCellClasses } from '@mui/material/TableCell';
const rows = [
  { lender: '0*F948657634920', amount: '2ETH', status: 'PAID' },
  { lender: '0*F948657634920', amount: '0ETH', status: 'PROCESSING' },
  { lender: '0*F948657634920', amount: '0ETH', status: 'REJECTED' },
  { lender: '0*F948657634920', amount: '0ETH', status: 'ACCEPTED' },
  { lender: '0*F948657634920', amount: '3ETH', status: 'LOANED' }
];

const LendersList = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
      <TableContainer component={Paper}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: 'none'
            }
          }}
        >
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Lender&apos;s address</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount lended</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.status}>
                <TableCell align="left">{row.lender}</TableCell>
                <TableCell align="left">{row.amount}</TableCell>
                <TableCell align="left">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LendersList;
