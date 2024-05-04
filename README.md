## Tech Stack/ Tooling

JavaScript(React JS), Redux Toolkit, Material UI, Blockchain, Hardhat, Solidity, ChainLink, IPFS

## Project Scripts

In the project directory, you can run the following:

First step:
在 ./FTGP23_Group5_05 终端目录下运行, npm start

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

首先在 defilendingdappbackend 添加.env 文件加上 ALCHEMY_API_KEY_URL 和 SEPOLIA_PRIVATE_KEY

Second step: 在 FTGP23_Group5_05/defilendingdappbackend 终端目录下运行 npx hardhat compile

### `npx hardhat compile`

Compiles the solidity code.

Third step:

### `npx hardhat run scripts/deploy.js --network sepolia`

在 FTGP23_Group5_05/defilendingdappbackend 终端目录下运行，`npx hardhat run scripts/deploy.js --network sepolia`
Deploys the smart contract to the sepolia Test Network

Forth step:
将合约地址和 abi 赋值给（如果合约没改就不用改 abi）src/constants/index.js

## Point to Note

1. Create a .env file that will store your private key and your Alchemy api key url.
2. Copy your ABI file and your deployed smart contract address and in the index.js file on the frontend.
