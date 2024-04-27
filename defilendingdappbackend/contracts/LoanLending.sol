//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract LoanLending is Pausable, ReentrancyGuard,AccessControl,Ownable{
uint256 id = 0;
 enum LoanState {
    REPAID,
    CREATED,
    FUNDED,
    TAKEN,
    FAILED
    }
enum CollateralState {
    PAID,
    WALLET_LOCKED,
    GUARANTOR,
    WAITING,
    NOT_PAID
}
enum TypeOfSecurity {
    COLLATERAL,
    WALLETLOCK,
    GUARANTOR
}
LoanState loanStateChoice;
 CollateralState collateralStateChoice;
 TypeOfSecurity typeofSecurityChoice;
struct CRYPTOBorrowers{
 address borrower;
 address lender;
 uint256 amtNeededETH;
 uint256 amtRemainingETH;
 uint256 amtRaised;
 //uint256 collateralAmount;
 uint256 collateralDeposits;
 uint256 loanDuration;
 uint256 interestPercentage;
 uint256 returnAmount;
 uint256 id;
}
struct ITEMBorrowers{
 address myAddress;
 string itemCategory;
 string itemName;
 string location;
 string description;
 uint256 loanDuration;
 string imgURI;
 uint256 collateralDeposits;
 address lender;
 //uint256 interestPercentage;
 uint256 id;
}
mapping(address => CRYPTOBorrowers) cryptoBorrower;
mapping(address => ITEMBorrowers) itemBorrower;
address[] public borrowers;
address[] public lenders;
address[] public mortgageBorrowers;
address[] public electronicsBorrowers;
address[] public automotiveBorrowers;
address[] public gardeningBorrowers;
address[] public householdBorrowers;
address[] public countryAidBorrowers;
event CollateralPaid(address indexed sender,uint256 collateralAmount,uint256 timestamp);
event Lend(address, uint256);
event Repay(address, uint256);
constructor() {
    }
function createCryptoLoan(address _address, uint256 _amtNeededInETH, uint256 _loanDuration, string memory _collateralType,uint256 _interestPercentage/*,uint256 _collateralAmount*/) public payable{

//make sure borrower doesnt have another outstanding loan
require(checkIfBorrowedBefore(_address),'You have an outstanding loan');
//check type of security chosen
if(keccak256(abi.encodePacked(_collateralType))==keccak256(abi.encodePacked('LOCK WALLET'))){
    //if security chosen is lockwallet , change typeofsecurity state to walletlocked,lock wallet for duration similar to loan duartion
typeofSecurityChoice = TypeOfSecurity.WALLETLOCK;
}
//if security chosen is collateral first change it to eth,change typeofsecurity state to collateral, change state to waiting ,send collateral to smart contract,change state to arrived
else if(keccak256(abi.encodePacked(_collateralType))==keccak256(abi.encodePacked('ETH'))){
    console.log('hello');
    typeofSecurityChoice = TypeOfSecurity.COLLATERAL;
      uint256 interest = _interestPercentage/100 * _amtNeededInETH * _loanDuration/12;
      uint256 returnAmount = interest + _amtNeededInETH;
    //send collateral to smart contract
     require(msg.value >= _amtNeededInETH/2,'The amount of collateral is not enough');
    cryptoBorrower[_address].collateralDeposits += msg.value;
    //emit event
    emit CollateralPaid(msg.sender,msg.value,block.timestamp);
    collateralStateChoice = CollateralState.PAID;
    CRYPTOBorrowers storage borrower = cryptoBorrower[_address];
    borrower.borrower = _address;
    borrower.amtNeededETH = _amtNeededInETH;
    borrower.loanDuration = _loanDuration;
    borrower.interestPercentage = _interestPercentage;
    borrower.returnAmount = returnAmount;
    borrower.amtRaised = 0;
    borrower.collateralDeposits = msg.value;
    borrower.amtRemainingETH = borrower.amtNeededETH - borrower.amtRaised;
    borrower.id = getId();
    borrowers.push(_address);
    loanStateChoice = LoanState.CREATED;
}else{
typeofSecurityChoice = TypeOfSecurity.GUARANTOR;
}
console.log('loaned');
loanStateChoice = LoanState.CREATED;


}
function createItemLoan(address _address,  string memory _category, string memory _item,string memory _location,string memory _description, uint256 _loanDuration, string memory _imageURI,uint256 _collateral) public payable{
require(checkIfBorrowedBefore(_address),'You have an outstanding loan');
require(msg.value >= _collateral,'The amount of collateral is not enough');
if(keccak256(abi.encodePacked(_category))==keccak256(abi.encodePacked('Mortgage'))){
itemBorrower[_address].collateralDeposits += msg.value;
emit CollateralPaid(msg.sender,msg.value,block.timestamp);
collateralStateChoice = CollateralState.PAID;
    ITEMBorrowers storage borrower = itemBorrower[_address];
    borrower.myAddress = _address;
    borrower.itemCategory = _category;
    borrower.itemName = _item;
    borrower.location = _location;
    borrower.description = _description;
    borrower.loanDuration = _loanDuration;
    borrower.imgURI = _imageURI;
    borrower.collateralDeposits = msg.value;
    //borrower.amtRemainingETH = borrower.amtNeededETH - borrower.amtRaised;
    borrower.id = getId();
    mortgageBorrowers.push(_address);
    loanStateChoice = LoanState.CREATED;
}else if(keccak256(abi.encodePacked(_category))==keccak256(abi.encodePacked('Electronics'))){
 itemBorrower[_address].collateralDeposits += msg.value;
emit CollateralPaid(msg.sender,msg.value,block.timestamp);
collateralStateChoice = CollateralState.PAID;
    ITEMBorrowers storage borrower = itemBorrower[_address];
    borrower.myAddress = _address;
    borrower.itemCategory = _category;
    borrower.itemName = _item;
    borrower.location = _location;
    borrower.description = _description;
    borrower.loanDuration = _loanDuration;
    borrower.imgURI = _imageURI;
    borrower.collateralDeposits = msg.value;
    //borrower.amtRemainingETH = borrower.amtNeededETH - borrower.amtRaised;
    borrower.id = getId();
    electronicsBorrowers.push(_address);
    loanStateChoice = LoanState.CREATED;
}else if(keccak256(abi.encodePacked(_category))==keccak256(abi.encodePacked('Automotive'))){
itemBorrower[_address].collateralDeposits += msg.value;
emit CollateralPaid(msg.sender,msg.value,block.timestamp);
collateralStateChoice = CollateralState.PAID;
    ITEMBorrowers storage borrower = itemBorrower[_address];
    borrower.myAddress = _address;
    borrower.itemCategory = _category;
    borrower.itemName = _item;
    borrower.location = _location;
    borrower.description = _description;
    borrower.loanDuration = _loanDuration;
    borrower.imgURI = _imageURI;
    borrower.collateralDeposits = msg.value;
    //borrower.amtRemainingETH = borrower.amtNeededETH - borrower.amtRaised;
    borrower.id = getId();
    automotiveBorrowers.push(_address);
    loanStateChoice = LoanState.CREATED;
}else if(keccak256(abi.encodePacked(_category))==keccak256(abi.encodePacked('Household'))){
 itemBorrower[_address].collateralDeposits += msg.value;
emit CollateralPaid(msg.sender,msg.value,block.timestamp);
collateralStateChoice = CollateralState.PAID;
    ITEMBorrowers storage borrower = itemBorrower[_address];
    borrower.myAddress = _address;
    borrower.itemCategory = _category;
    borrower.itemName = _item;
    borrower.location = _location;
    borrower.description = _description;
    borrower.loanDuration = _loanDuration;
    borrower.imgURI = _imageURI;
    borrower.collateralDeposits = msg.value;
    borrower.id = getId();
    householdBorrowers.push(_address);
    loanStateChoice = LoanState.CREATED;
}else{
itemBorrower[_address].collateralDeposits += msg.value;
emit CollateralPaid(msg.sender,msg.value,block.timestamp);
collateralStateChoice = CollateralState.PAID;
    ITEMBorrowers storage borrower = itemBorrower[_address];
    borrower.myAddress = _address;
    borrower.itemCategory = _category;
    borrower.itemName = _item;
    borrower.location = _location;
    borrower.description = _description;
    borrower.loanDuration = _loanDuration;
    borrower.imgURI = _imageURI;
    borrower.collateralDeposits = msg.value;
    borrower.id = getId();
    countryAidBorrowers.push(_address);
    loanStateChoice = LoanState.CREATED;
}

}
function checkIfBorrowedBefore(address _address) public view returns (bool){
    for(uint256 currentAddress=0; currentAddress<borrowers.length; currentAddress++){
        if(borrowers[currentAddress]== _address){
            return false;
        }
    }
    return true;
}
function cryptoBorrowers(address _address) public view returns(uint256,uint256,address){
    _address = msg.sender;
    require(!checkIfBorrowedBefore(msg.sender),'You do not have an outstanding loan');
    return (cryptoBorrower[_address].loanDuration,cryptoBorrower[_address].returnAmount,cryptoBorrower[_address].lender);
}
function getId() public returns (uint){
    id++;
    return id;
}
function getBorrowers() view public returns(address[] memory){
    return borrowers;
}
function getMortgageBorrowers() view public returns(address[] memory){
    return mortgageBorrowers;
}
function getElectronicsBorrowers() view public returns(address[] memory){
    return electronicsBorrowers;
}
function getAutomotiveBorrowers() view public returns(address[] memory){
    return automotiveBorrowers;
}
function getHouseholdBorrowers() view public returns(address[] memory){
    return householdBorrowers;
}
function getCountryBorrowers() view public returns(address[] memory){
    return countryAidBorrowers;
}
function getBorrower(address _address) public view returns(uint256,uint256,uint256,uint256,uint256,uint256,uint256){
return (cryptoBorrower[_address].amtNeededETH,cryptoBorrower[_address].loanDuration,cryptoBorrower[_address].interestPercentage,cryptoBorrower[_address].returnAmount,cryptoBorrower[_address].amtRaised,cryptoBorrower[_address].amtRemainingETH,cryptoBorrower[_address].id);
}
//change so that only borrower can withdraw funds
  function withdrawFunds(address payable  _borrower) public payable nonReentrant{
      require(msg.sender == cryptoBorrower[_borrower].borrower,'You have no rights to withdraw');
      require(cryptoBorrower[_borrower].collateralDeposits >0,'You have to pay collateral');
      _borrower.transfer(cryptoBorrower[_borrower].amtRaised);
       //uint256 _amtRaised = cryptoBorrower[_borrower].amtRaised;
     cryptoBorrower[_borrower].amtRaised = 0;
    //_borrower.call{value:_amtRaised}("");
  }  
  function cryptoLend(address payable _borrower, address _lender) external payable{
   require(_lender != cryptoBorrower[_borrower].borrower,'You cannot lend to yourself');
   require(msg.value == cryptoBorrower[_borrower].amtNeededETH,'You must loan the exact amount');
   cryptoBorrower[_borrower].amtRaised +=msg.value;
   emit Lend(_borrower, msg.value);
   loanStateChoice = LoanState.FUNDED;
   cryptoBorrower[_borrower].lender = msg.sender;
   cryptoBorrower[_borrower].amtRemainingETH = cryptoBorrower[_borrower].amtNeededETH - cryptoBorrower[_borrower].amtRaised;
  }
  function fetchMortgageBorrowers(address _address) public view returns(address,string memory,string memory,string memory,string memory,uint256,uint256){
    return (itemBorrower[_address].myAddress,itemBorrower[_address].itemName,itemBorrower[_address].location,itemBorrower[_address].description,itemBorrower[_address].imgURI,itemBorrower[_address].collateralDeposits,itemBorrower[_address].loanDuration);
  }
  function fetchElectronicsBorrowers(address _address) public view returns(address,string memory,string memory,string memory,string memory,uint256,uint256){
    return (itemBorrower[_address].myAddress,itemBorrower[_address].itemName,itemBorrower[_address].location,itemBorrower[_address].description,itemBorrower[_address].imgURI,itemBorrower[_address].collateralDeposits,itemBorrower[_address].loanDuration);
  }
  function cryptoRepay(address payable _borrower)public payable nonReentrant{
    //require(msg.value == cryptoBorrower[_borrower].returnAmount,'You have to pay the full amount');
     (bool success,) = payable(cryptoBorrower[_borrower].lender).call{value: msg.value}("");
      require(success, "Failed to send Ether");
    cryptoBorrower[msg.sender].returnAmount = 0;
    emit Repay(msg.sender,msg.value);
    loanStateChoice = LoanState.REPAID;
    _borrower.transfer(cryptoBorrower[_borrower].collateralDeposits);
    //selfdestruct(_borrower);//remove address from list of borrowers
    for(uint256 index = 0; index<borrowers.length-1; index++){
        if(borrowers[index]==_borrower){
            borrowers[index] = borrowers[index+1];
        }
    }
    borrowers.pop();
  }
}