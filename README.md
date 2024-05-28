## Tech Stack / Tooling

- JavaScript (React JS)
- Redux Toolkit
- Material UI
- Blockchain Technologies:
  - Hardhat
  - Solidity
  - ChainLink
  - IPFS

## DApp Process Flow

![DApp Process Flow](image/Fig2.jpg)

## User Interface

![User Interface](image/Fig1.jpg)

## Important Points
1. Create a `.env` file in `defilendingdappbackend` to store your private key and Alchemy API key URL.
2. Ensure your ABI file and the deployed smart contract address (`0x9942AccE4476C3cB462Ba3f23D9424eD85937512`) are correctly referenced in the `src/constants/index.js` file on the frontend.

## Project Scripts

In the project directory, you can execute the following commands:

### First step:

In the terminal directory `./FTGP23_Group5_05`, run:

```
npm start
```
This command compiles the Solidity code from `LoanLending.sol`. Note that only this file is required for the main application. The file `Loanlendingdraftfuture.sol` is a draft and does not need to be compiled or run.

### Second step:
In the terminal directory `FTGP23_Group5_05/defilendingdappbackend`, run:

```
npx hardhat compile LoanLending.sol
```

### Third step:
In the terminal directory `FTGP23_Group5_05/backend`, run:

```
npx hardhat run scripts/deploy.js --network sepolia
```
This command deploys the smart contract to the Sepolia Test Network.

### Fourth step:
After deployment, copy the contract address and ABI. Update the ABI in `src/constants/index.js` only if the contract has changed. The deployed contract address is `0x9942AccE4476C3cB462Ba3f23D9424eD85937512`.


This provides a complete guide on how to compile and deploy your Solidity contracts as part of your DApp project.
