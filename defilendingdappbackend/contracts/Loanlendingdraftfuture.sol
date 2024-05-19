// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "hardhat/console.sol";

contract LoanLending is Pausable, ReentrancyGuard, AccessControl, Ownable {
    uint256 id = 0;
    enum LoanState { CREATED, FUNDED, TAKEN, REPAID, FAILED }
    enum CollateralState { NOT_PAID, PAID, WALLET_LOCKED, GUARANTOR, WAITING }
    enum TypeOfSecurity { COLLATERAL, WALLETLOCK, GUARANTOR }

    LoanState loanStateChoice;
    CollateralState collateralStateChoice;
    TypeOfSecurity typeofSecurityChoice;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LENDER_ROLE = keccak256("LENDER_ROLE");

    struct Borrower {
        address borrower;
        address lender;
        uint256 amtNeededETH;
        uint256 amtRemainingETH;
        uint256 amtRaised;
        uint256 collateralDeposits;
        uint256 loanDuration; // Assuming this is in days for clarity
        uint256 interestPercentage;
        uint256 returnAmount;
        uint256 id;
        string itemCategory;
        string itemName;
        string location;
        string description;
        string imgURI;
        LoanState loanState;
        CollateralState collateralState;
    }

    mapping(address => Borrower) public borrowers;
    address[] public borrowerAddresses;

    event CollateralPaid(address indexed sender, uint256 collateralAmount, uint256 timestamp);
    event LoanCreated(address indexed borrower, uint256 amount, uint256 duration, uint256 timestamp);
    event Lend(address indexed borrower, uint256 amount);
    event Repay(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount, uint256 timestamp);
    event LoanDefaulted(address indexed borrower, uint256 timestamp);
    event LoanExtended(address indexed borrower, uint256 newDuration);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(LENDER_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyLender() {
        require(hasRole(LENDER_ROLE, msg.sender), "Caller is not a lender");
        _;
    }

    function createLoan(
        address _address,
        uint256 _amtNeededInETH,
        uint256 _loanDuration,
        string memory _collateralType,
        uint256 _interestPercentage,
        string memory _category,
        string memory _item,
        string memory _location,
        string memory _description,
        string memory _imageURI,
        uint256 _collateral
    ) public payable {
        require(checkIfBorrowedBefore(_address), 'You have an outstanding loan');
        require(msg.value >= _collateral, 'The amount of collateral is not enough');
        require(keccak256(abi.encodePacked(_category)) == keccak256(abi.encodePacked('Mortgage')), "Mortgage category is allowed");

        TypeOfSecurity securityType;
        uint256 interest = (_interestPercentage / 100) * _amtNeededInETH * (_loanDuration / 30); // Assuming _loanDuration is in days
        uint256 returnAmount = interest + _amtNeededInETH;

        if (keccak256(abi.encodePacked(_collateralType)) == keccak256(abi.encodePacked('LOCK WALLET'))) {
            securityType = TypeOfSecurity.WALLETLOCK;
        } else if (keccak256(abi.encodePacked(_collateralType)) == keccak256(abi.encodePacked('ETH'))) {
            securityType = TypeOfSecurity.COLLATERAL;
            require(msg.value >= _amtNeededInETH / 2, 'The amount of collateral is not enough');
            emit CollateralPaid(msg.sender, msg.value, block.timestamp);
            collateralStateChoice = CollateralState.PAID;
        } else {
            securityType = TypeOfSecurity.GUARANTOR;
        }

        handleLoanCreation(
            _address,
            _amtNeededInETH,
            _loanDuration,
            _interestPercentage,
            returnAmount, 
            _collateral,
            _category,
            _item,
            _location,
            _description,
            _imageURI
        );
    }

    function checkIfBorrowedBefore(address _address) public view returns (bool) {
        for (uint256 currentAddress = 0; currentAddress < borrowerAddresses.length; currentAddress++) {
            if (borrowerAddresses[currentAddress] == _address) {
                return false;
            }
        }
        return true;
    }

    function cryptoBorrowers(address _address) public view returns (uint256, uint256, address) {
        _address = msg.sender;
        require(!checkIfBorrowedBefore(msg.sender), 'You do not have an outstanding loan');
        Borrower storage borrower = borrowers[_address];
        return (borrower.loanDuration, borrower.returnAmount, borrower.lender);
    }

    function getId() public returns (uint) {
        id++;
        return id;
    }

    function getBorrowers() view public returns (address[] memory) {
        return borrowerAddresses;
    }

    function getBorrower(address _address) public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256) {
        Borrower storage borrower = borrowers[_address];
        return (borrower.amtNeededETH, borrower.loanDuration, borrower.interestPercentage, borrower.returnAmount, borrower.amtRaised, borrower.amtRemainingETH, borrower.id);
    }

    function withdrawFunds(address payable _borrower) public payable nonReentrant {
        Borrower storage borrower = borrowers[_borrower];
        require(msg.sender == borrower.borrower, 'You have no rights to withdraw');
        require(borrower.collateralDeposits > 0, 'You have to pay collateral');
        _borrower.transfer(borrower.amtRaised);
        borrower.amtRaised = 0;
    }

    function cryptoLend(address payable _borrower, address _lender) external payable onlyLender {
        Borrower storage borrower = borrowers[_borrower];
        require(_lender != borrower.borrower, 'You cannot lend to yourself');

        if (msg.value > borrower.amtRemainingETH) {
            revert('Exceed the loan limit');
        }

        borrower.amtRaised += msg.value;
        emit Lend(_borrower, msg.value);

        if (borrower.amtRaised == borrower.amtNeededETH) {
            borrower.loanState = LoanState.FUNDED;
        }

        borrower.lender = msg.sender;
        borrower.amtRemainingETH = borrower.amtNeededETH - borrower.amtRaised;
    }

    function fetchMortgageBorrowers(address _address) public view returns (address, string memory, string memory, string memory, string memory, uint256, uint256) {
        Borrower storage borrower = borrowers[_address];
        return (borrower.borrower, borrower.itemName, borrower.location, borrower.description, borrower.imgURI, borrower.collateralDeposits, borrower.loanDuration);
    }

    function repayLoan(address payable _borrower) public payable nonReentrant {
        Borrower storage borrower = borrowers[_borrower];
        require(msg.value >= borrower.returnAmount, 'Insufficient repayment amount');

        (bool success, ) = borrower.lender.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        borrower.loanState = LoanState.REPAID;
        emit Repay(_borrower, msg.value);
        _borrower.transfer(borrower.collateralDeposits);

        for (uint256 i = 0; i < borrowerAddresses.length; i++) {
            if (borrowerAddresses[i] == _borrower) {
                borrowerAddresses[i] = borrowerAddresses[borrowerAddresses.length - 1];
                borrowerAddresses.pop();
                break;
            }
        }

        emit LoanRepaid(_borrower, msg.value, block.timestamp);
    }

    function checkOverdue(address _borrower) internal view returns (bool) {
        Borrower storage borrower = borrowers[_borrower];
        if (borrower.loanDuration == 0) {
            return false; // 不会逾期
        }
        uint256 dueDate = borrower.loanDuration * 1 days;
        return block.timestamp > dueDate;
    }

    function confiscateCollateral(address _borrower) public onlyAdmin {
        require(checkOverdue(_borrower), "Loan is not overdue");

        Borrower storage borrower = borrowers[_borrower];
        address lender = borrower.lender;

        payable(lender).transfer(borrower.collateralDeposits);
        borrower.collateralDeposits = 0;

        borrower.loanState = LoanState.FAILED;

        for (uint256 index = 0; index < borrowerAddresses.length; index++) {
            if (borrowerAddresses[index] == _borrower) {
                borrowerAddresses[index] = borrowerAddresses[borrowerAddresses.length - 1];
                borrowerAddresses.pop();
                break;
            }
        }

        emit LoanDefaulted(_borrower, block.timestamp);
    }

    function handleDefault(address _borrower) public onlyAdmin {
        confiscateCollateral(_borrower);
    }

    function requestExtension(address _borrower) public onlyAdmin {
        Borrower storage borrower = borrowers[_borrower];
        require(borrower.loanState == LoanState.FUNDED, "Loan must be funded to request extension");

        borrower.loanDuration += 30; 
        borrower.returnAmount += 0.2 ether; 
        payable(borrower.lender).transfer(0.2 ether); 

        emit LoanExtended(_borrower, borrower.loanDuration);
    }

    function handleLoanCreation(
        address _borrower,
        uint256 _amtNeededInETH,
        uint256 _loanDuration,
        uint256 _interestPercentage,
        uint256 _returnAmount, 
        uint256 _collateral,
        string memory _category,
        string memory _item,
        string memory _location,
        string memory _description,
        string memory _imageURI
    ) internal {
        Borrower storage borrower = borrowers[_borrower];
        borrower.borrower = _borrower;
        borrower.amtNeededETH = _amtNeededInETH;
        borrower.loanDuration = _loanDuration;
        borrower.interestPercentage = _interestPercentage;
        borrower.returnAmount = _returnAmount;
        borrower.amtRaised = 0;
        borrower.collateralDeposits = _collateral;
        borrower.amtRemainingETH = _amtNeededInETH;
        borrower.id = getId();
        borrower.itemCategory = _category;
        borrower.itemName = _item;
        borrower.location = _location;
        borrower.description = _description;
        borrower.imgURI = _imageURI;
        borrower.loanState = LoanState.CREATED;
        borrowerAddresses.push(_borrower);
        emit LoanCreated(_borrower, _amtNeededInETH, _loanDuration, block.timestamp);
    }
}

