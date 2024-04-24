import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { tableCellClasses } from '@mui/material/TableCell';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { getETHPrice } from '../utils/getEthPrice';
const useStyles = makeStyles(theme => ({
  lendingModalComponent: {
    [theme.breakpoints.up('sm')]: {
      width: '90vw'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('md')]: {
      width: '72vw'
    }
  },
  LendingTableContainer: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '500px'
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '800px'
    }
  }
}));

const LendingTable = () => {
  const classes = useStyles();
  const [allData, setAllData] = React.useState([]);
  const [showlendModal, setShowLendModal] = React.useState(false);
  const [amountToLend, setAmountToLend] = React.useState('');
  const [borrowersAddress, setBorrowersAddress] = React.useState('');
  const [borrowed, setBorrowed] = React.useState(false);
  function createData(
    id,
    address,
    amountNeeded,
    loanDuration,
    interestPercentage,
    returnAmount,
    amountRaised,
    AmountRemaining,
    amountNeededUSD,
    amountRaisedUSD,
    amountRemainingUSD,
    returnAmountUSD
  ) {
    return {
      id,
      address,
      amountNeeded,
      loanDuration,
      interestPercentage,
      returnAmount,
      amountRaised,
      AmountRemaining,
      amountNeededUSD,
      amountRaisedUSD,
      amountRemainingUSD,
      returnAmountUSD
    };
  }
  const address = useSelector(state => state.connectWallet.address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));

  const withdraw = async () => {
    try {
      const tx = await contract.withdrawFunds(address);
      tx.wait();
      //allData.splice(allData.indexOf(el), 1);
      //allData.splice(allData.findIndex(a => a.id === itemToBeRemoved.id) , 1)
      //let filteredAllData = allData.filter(borrower => borrower.address !== address);
      //console.log('filteredData', filteredAllData);
      //setAllData(filteredAllData);
      setBorrowed(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isCancelled = true;
    const getCryptoBorrowerAddresses = async () => {
      try {
        const cryptoBorrowersAddresses = await contract.getBorrowers();
        return cryptoBorrowersAddresses;
      } catch (err) {
        console.error(err);
      }
    };
    const getcryptoBorrowerInfo = async () => {
      try {
        let addressValue = await getCryptoBorrowerAddresses();
        let valuePrice = await getETHPrice();
        return Promise.all(
          addressValue.map(async singleAddress => {
            const cryptoBorrowerInfo = await contract.getBorrower(singleAddress);
            const allCryptoBorrowersInfo = await Promise.all(cryptoBorrowerInfo).then(allResults => {
              return createData(
                /**id */
                parseInt(allResults[6]),
                /**address */
                singleAddress,
                /**amount needed in eth */
                ethers.utils.formatEther(allResults[0]),
                /**loan duration */
                parseFloat(allResults[1]) / 10,
                /**interest% */
                parseFloat(allResults[2]) / 1000,
                /**returnamount */
                Number(ethers.utils.formatEther(allResults[3])).toFixed(4),
                /**amountRaised */
                ethers.utils.formatEther(allResults[4]),
                /**amountRemaining */
                ethers.utils.formatEther(allResults[5]),
                /**amount needed in usd */

                Number(ethers.utils.formatEther(allResults[0]) * valuePrice).toFixed(2),
                /**amountRaised USD */
                Number(ethers.utils.formatEther(allResults[4]) * valuePrice).toFixed(2),

                /**amountRemaining USD */
                Number(ethers.utils.formatEther(allResults[5]) * valuePrice).toFixed(2),

                /**returnAmountUSD */
                Number(ethers.utils.formatEther(allResults[3]) * valuePrice).toFixed(2)
              );
            });
            return allCryptoBorrowersInfo;
          })
        );
      } catch (err) {
        console.error(err);
      }
    };
    const setCryptoBrowserInfo = async () => {
      try {
        if (isCancelled) {
          await getcryptoBorrowerInfo().then(data => setAllData(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    setCryptoBrowserInfo();
    return () => {
      isCancelled = false;
    };
  }, []);
  const LendingModal = () => {
    const classes = useStyles();
    const lend = async e => {
      e.preventDefault();
      await contract.cryptoLend(borrowersAddress, address, {
        from: address,
        value: ethers.utils.parseUnits(amountToLend.toString(), 'ether')
      });
      //console.log()
      setShowLendModal(!showlendModal);
    };
    return (
      <>
        {showlendModal && (
          <div
            className={classes.lendingModalComponent}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50vh'
              //width: '70vw',
              //backgroundColor: 'red'
            }}
          >
            <Box
              p={5}
              mt={-5}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                //backgroundColor: 'red',
                marginLeft: 'auto',
                marginRight: 'auto',
                boxShadow: '10px 2px 20px 1px'
              }}
            >
              <Box>
                <CloseIcon
                  sx={{ marginBottom: 2, marginLeft: 60, color: 'black', cursor: 'pointer' }}
                  onClick={() => setShowLendModal(false)}
                />
                <form onSubmit={lend}>
                  <TextField
                    required
                    type="text"
                    id="address"
                    label="Borrowers address"
                    color="primary"
                    focused
                    name="Address"
                    value={borrowersAddress}
                    fullWidth
                    sx={{ marginBottom: 3 }}
                  />

                  <TextField
                    required
                    type="number"
                    id="amount"
                    label="Amount to lend in ETH"
                    color="primary"
                    focused
                    name="Amount"
                    value={amountToLend}
                    onChange={e => {
                      setAmountToLend(e.target.value);
                    }}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                      inputProps: { min: 0.0, step: '0.01' }
                    }}
                    sx={{ marginBottom: 3 }}
                  />
                  <Button variant="contained" type="submit">
                    Send
                  </Button>
                </form>
              </Box>
            </Box>
          </div>
        )}
      </>
    );
  };
  return (
    <div style={{ width: '100%' }}>
      <Container
        className={classes.LendingTableContainer}
        maxWidth="lg"
        sx={{
          paddingLeft: '8px',
          paddingRight: '8px',
          marginTop: 4
        }}
      >
        {!showlendModal && (
          <TableContainer component={Paper} sx={{ zIndex: -1000 }}>
            <Table
              sx={{
                //maxWidth: '300px',
                //width: '50vw',
                overflow: 'scroll',
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: 'none'
                }
              }}
            >
              <TableHead sx={{ backgroundColor: '#173e43' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Borrower&apos;s Address</TableCell>
                  <TableCell sx={{ color: 'white' }}>Amount Needed</TableCell>
                  <TableCell sx={{ color: 'white' }}>Loan Duration</TableCell>
                  <TableCell sx={{ color: 'white' }}>Interest Percentage</TableCell>
                  <TableCell sx={{ color: 'white' }}>Return Amount</TableCell>
                  <TableCell sx={{ color: 'white' }}>Amount Raised</TableCell>
                  <TableCell sx={{ color: 'white' }}>Amount Remaining</TableCell>
                  <TableCell sx={{ color: 'white' }}>Lend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allData ? (
                  allData.map(row => (
                    <TableRow key={row.id}>
                      <TableCell align="left">
                        {row.address.slice(0, 4)}...{row.address.slice(35)}
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{row.amountNeeded}ETH</Typography>
                        <Typography variant="body2" sx={{ color: 'red' }}>
                          ${row.amountNeededUSD}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.loanDuration * 30}days</TableCell>
                      <TableCell align="left">{row.interestPercentage}%</TableCell>
                      <TableCell align="left">
                        <Typography>{row.returnAmount}ETH</Typography>
                        <Typography variant="body2" sx={{ color: 'red' }}>
                          ${row.returnAmountUSD}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{row.amountRaised}ETH</Typography>
                        <Typography variant="body2" sx={{ color: 'red' }}>
                          ${row.amountRaisedUSD}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{row.AmountRemaining}ETH</Typography>
                        <Typography variant="body2" sx={{ color: 'red' }}>
                          ${row.amountRemainingUSD}
                        </Typography>
                      </TableCell>
                      {/* <TableCell align="left" sx={{ color: row.status === 'LOANED' ? 'red' : 'green' }}>
                    {row.status}
              </TableCell>*/}
                      <TableCell align="left" sx={{ display: 'flex', alignItems: 'center' }}>
                        {/*row.amountRaised !== row.amountNeeded && (
                          <Button
                            variant="contained"
                            disabled={borrowed}
                            onClick={() => {
                              setShowLendModal(true);
                              setBorrowersAddress(row.address);
                            }}
                          >
                            Lend
                          </Button>
                        )}*/}
                        {row.AmountRemaining == 0.0 ? (
                          <Button variant="contained" disabled>
                            Lend
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => {
                              setShowLendModal(true);
                              setBorrowersAddress(row.address);
                            }}
                          >
                            Lend
                          </Button>
                        )}
                        {row.amountRaised >= row.amountNeeded && (
                          <Button variant="contained" onClick={withdraw}>
                            Withdraw
                          </Button>
                        )}
                        {/*row.amountRaised <= 0 && <DeleteIcon sx={{ cursor: 'pointer', color: 'red', marginLeft: 2 }} />*/}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <Box>
                    <Typography align="center">No borrowers yet</Typography>
                  </Box>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <LendingModal />
      </Container>
    </div>
  );
};

export default LendingTable;
