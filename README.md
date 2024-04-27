# Loan Lending Decentralized Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [Hardhat](https://hardhat.org/).

## Features and Interfaces

### LoginPage

![LoginPage](/src/assets/Loginpage.png)

### HomePage

![HomePage](/src/assets/HomePage.png)

### LendingPage

![LendingPage](</src/assets/LendingPage%20(1).png>)

### MortgageLendingPage

![MortgageLendingPage](/src/assets/2022-06-06.png)

### BorrowingPage

![BorrowingPage](/src/assets/BorrowPage.png)

### PayOutPage

![PayOutPage](/src/assets/PayoutPage.png)

## Tech Stack/ Tooling

JavaScript(React JS), Redux Toolkit, Material UI, Blockchain, Hardhat, Solidity, ChainLink, IPFS

## Project Scripts

In the project directory, you can run the following:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npx hardhat compile`

Compiles the solidity code.

### `npx hardhat run scripts/deploy.js --network rinkeby`

npx hardhat run scripts/deploy.js --network sepolia

Deploys the smart contract to the Rinkeby Test Network

## Point to Note

1. Create a .env file that will store your private key and your Alchemy api key url.

2. Copy your ABI file and your deployed smart contract address and in the index.js file on the frontend.
