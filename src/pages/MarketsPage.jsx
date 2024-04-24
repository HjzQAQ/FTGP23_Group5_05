import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import Navbar from '../components/Navbar';
function createData(market, totalSupply, supplyAPY, totalBorrow, borrowAPY) {
  return { market, totalSupply, supplyAPY, totalBorrow, borrowAPY };
}
const rows = [
  createData('Ether', 3285.99, 0.08, 127.58, 2.76),
  createData('Dai', 2925.33, 2.44, 2064.87, 4.11),
  createData('USD Coin', 2547.18, 1.7, 1440.19, 3.28),
  createData('Wrapped BTC', 1294.14, 0.09, 47.5, 3.28),
  createData('Tether', 808.53, 2.09, 506.06, 3.63)
];
const columns = [
  { id: 'market', label: 'Market', minWidth: 170 },
  { id: 'totalSupply', label: 'Total Supply', minWidth: 100 },
  {
    id: 'supplyAPY',
    label: 'Supply APY',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'totalBorrow',
    label: 'Total Borrow',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'borrowAPY',
    label: 'Borrow APY',
    minWidth: 170,
    align: 'right'
  }
];

const MarketsPage = () => {
  return (
    <div>
      <Navbar />
      <Container maxWidth="lg">
        <Paper sx={{ width: '100%' }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: 700, fontSize: '20px' }} colSpan={5}>
                    All Markets
                  </TableCell>
                </TableRow>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 57, minWidth: column.minWidth, color: 'grey' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.marketcd} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.market}
                    </TableCell>
                    <TableCell align="right">{row.totalSupply}</TableCell>
                    <TableCell align="right">{row.supplyAPY}</TableCell>
                    <TableCell align="right">{row.totalBorrow}</TableCell>
                    <TableCell align="right">{row.borrowAPY}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default MarketsPage;
