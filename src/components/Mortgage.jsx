import React, { useEffect } from 'react';
import Item from './Item';
import { Box, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';
import EmptyImage from '../assets/empty.png';

const Mortgage = () => {
  const address = useSelector(state => state.connectWallet.address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));
  const [allMortgageData, setAllMortgageData] = React.useState([]);
  function createData(address, itemName, location, description, imgURI, collateralDeposits, loanDuration) {
    return {
      address,
      itemName,
      location,
      description,
      imgURI,
      collateralDeposits,
      loanDuration
    };
  }
  useEffect(() => {
    let isCancelled = true;
    const getMortgageBorrowers = async () => {
      try {
        let mortgageBorrowers = await contract.getMortgageBorrowers();
        return mortgageBorrowers;
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMortgageBorrowersInfo = async () => {
      try {
        let mortgageAddresses = await getMortgageBorrowers();
        return Promise.all(
          mortgageAddresses.map(async singleMortgageAddress => {
            const mortgageBorrowersInfo = await contract.fetchMortgageBorrowers(singleMortgageAddress);
            const allMortgageBorrowersInfo = await Promise.all(mortgageBorrowersInfo).then(allResults => {
              return createData(
                singleMortgageAddress,
                //allResults[0],
                allResults[1],
                allResults[2],
                allResults[3],
                allResults[4],

                Number(ethers.utils.formatEther(allResults[5])).toFixed(2),
                parseFloat(allResults[6]) / 10
              );
            });
            console.log('allMortgageBorrowersInfo', allMortgageBorrowersInfo);
            return allMortgageBorrowersInfo;
          })
        );
      } catch (err) {
        console.error(err);
      }
    };
    const setMortgageBorrowerInfo = async () => {
      try {
        if (isCancelled) {
          await fetchMortgageBorrowersInfo().then(data => setAllMortgageData(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    setMortgageBorrowerInfo();
    //fetchMortgageBorrowersInfo();
    return () => {
      isCancelled = false;
    };
  }, []);
  return (
    <Grid
      container
      spacing={3}
      sx={{
        padding: 2,
        maxHeight: '100vh',
        overflow: 'scroll',
        /*scrollbarWidth: 0,*/
        /*backgroundColor: 'orange',*/
        margin: 0
        /*justifyContent: 'center',*/
        /*alignItems: 'center'*/
      }}
    >
      {allMortgageData.length != 0 ? (
        allMortgageData.map(mortgage => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            key={mortgage.address}
            sx={
              {
                //display: 'flex'
              }
            }
          >
            <Item
              img={mortgage.imgURI}
              addressBorrower={mortgage.address}
              itemName={mortgage.itemName}
              location={mortgage.location}
              description={mortgage.description}
              collateralDeposits={mortgage.collateralDeposits}
              loanDuration={mortgage.loanDuration}
            />
          </Grid>
        ))
      ) : (
        <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
          <Box
            mt={3}
            sx={{
              color: 'white',
              display: 'flex',
              height: '50vh',
              width: '50%',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <img src={EmptyImage} alt="Empty Image" />
          </Box>
        </div>
      )}
    </Grid>
  );
};

export default Mortgage;
