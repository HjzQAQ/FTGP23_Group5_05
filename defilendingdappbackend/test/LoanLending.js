const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('LoanLending', function () {
  it('Get ETH Value', async function () {
    const Contract = await ethers.getContractFactory('LoanLending');
    const contract = await Contract.deploy();
    await contract.deployed();

    const tx = await contract.getLatestPrice();

    // wait until the transaction is mined
    await tx.wait();

    // verify rate is set correctly
    expect(await contract.getRate()).to.equal(1000);
  });
});
