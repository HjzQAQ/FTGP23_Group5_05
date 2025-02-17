// require('@nomiclabs/hardhat-waffle');
// require('dotenv').config({ path: '.env' });

// // const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

// // const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// // eslint-disable-next-line no-undef
// task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// // You need to export an object to set up your config
// // Go to https://hardhat.org/config/ to learn more

// /**
//  * @type import('hardhat/config').HardhatUserConfig
//  */
// module.exports = {
//   solidity: '0.8.4',
//   networks: {
//     hardhat: {
//       chainId: 31337
//     },
//     // rinkeby: {
//     //   url: ALCHEMY_API_KEY_URL,
//     //   accounts: [RINKEBY_PRIVATE_KEY],
//     //   gasPrice: 8000000000
//     // }
//   }
// };

require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: '0.8.4',
  networks: {
    hardhat: {
      chainId: 31337
    },
    // rinkeby: {
    //   url: ALCHEMY_API_KEY_URL,
    //   accounts: [RINKEBY_PRIVATE_KEY],
    //   gasPrice: 8000000000
    // }
    sepolia: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      gasPrice: 8000000000
    }
  }
};
