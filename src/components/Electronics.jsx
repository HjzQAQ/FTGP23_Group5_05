import React, { useEffect } from 'react';
import Item from './Item';
import { Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { LOANLENDING_CONTRACT_ADDRESS, abi } from '../constants';
import EmptyImage from '../assets/empty.png';

const Electronics = () => {
  const address = useSelector(state => state.connectWallet.address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(LOANLENDING_CONTRACT_ADDRESS, abi, provider.getSigner(address));
  const [allElectronicData, setAllElectronicData] = React.useState([]);
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
    const getElectronicBorrowers = async () => {
      try {
        let electronicBorrowers = await contract.getElectronicsBorrowers();
        return electronicBorrowers;
      } catch (err) {
        console.error(err);
      }
    };
    const fetchElectronicsBorrowersInfo = async () => {
      try {
        let electronicAddresses = await getElectronicBorrowers();
        return Promise.all(
          electronicAddresses.map(async singleElectronicAddress => {
            const electronicBorrowersInfo = await contract.fetchElectronicsBorrowers(singleElectronicAddress);
            const allElectronicBorrowersInfo = await Promise.all(electronicBorrowersInfo).then(allResults => {
              return createData(
                singleElectronicAddress,
                //allResults[0],
                allResults[1],
                allResults[2],
                allResults[3],
                allResults[4],
                Number(ethers.utils.formatEther(allResults[5])).toFixed(2),
                parseFloat(allResults[6]) / 10
              );
            });
            return allElectronicBorrowersInfo;
          })
        );
      } catch (err) {
        console.error(err);
      }
    };
    const setElectronicBorrowerInfo = async () => {
      try {
        if (isCancelled) {
          await fetchElectronicsBorrowersInfo().then(data => setAllElectronicData(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    setElectronicBorrowerInfo();
    //fetchMortgageBorrowersInfo();
    return () => {
      isCancelled = false;
    };
  }, []);
  return (
    <div style={{ width: '100vw' }}>
      {allElectronicData.length != 0 ? (
        allElectronicData.map(electronic => (
          <Grid
            container
            spacing={3}
            sx={{ padding: 2, maxHeight: '100vh', overflow: 'scroll' }}
            key={electronic.address}
          >
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Item
                img={electronic.imgURI}
                addressBorrower={electronic.address}
                itemName={electronic.itemName}
                location={electronic.location}
                description={electronic.description}
                collateralDeposits={electronic.collateralDeposits}
                loanDuration={electronic.loanDuration}
              />
            </Grid>
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
    </div>
  );
};

export default Electronics;
