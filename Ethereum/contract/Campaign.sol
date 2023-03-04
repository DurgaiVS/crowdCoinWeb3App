// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract CampaignFactory {
    mapping(address => string) public campaignName;
    address payable[] private deployedAddr;

    function createCampaign(
        string memory manName,
        string memory campDesc,
        string memory campName,
        uint min,
        uint premium
    ) public {
        address newCampaign = address(
            new Campaign(
                payable(msg.sender),
                manName,
                campDesc,
                campName,
                min,
                premium
            )
        );
        deployedAddr.push(payable(newCampaign));
        campaignName[newCampaign] = campName;
    }

    function getCampaignAddr() public view returns (address payable[] memory) {
        return deployedAddr;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool completed;
        mapping(address => bool) hasVoted;
        uint yesVotes;
    }

    Request[] public requests;
    address payable public immutable manager;
    string public campaignName;
    string public managerName;
    string public campaignDesc;
    uint public minContribution;
    uint public premiumContribution;
    mapping(address => bool) private approvers;
    uint public approversCount;
    //mapping is similar to hash tables, key will be hashed.
    //the default return value will be the falsy value of that particular datatype.
    address[] private premiumContributors;

    modifier restriction() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        address payable creator,
        string memory manName,
        string memory campDesc,
        string memory campName,
        uint min,
        uint premium
    ) {
        manager = creator;
        managerName = manName;
        campaignDesc = campDesc;
        campaignName = campName;
        minContribution = min;
        premiumContribution = premium;
    }

    function contribution() public payable {
        if (msg.value >= minContribution) {
            if (!approvers[msg.sender]) {
                approversCount++;
            }
            approvers[msg.sender] = true;
        }
        if (msg.value >= premiumContribution) {
            premiumContributors.push(msg.sender);
        }
    }

    function createRequest(
        string memory desc,
        uint val,
        address payable toAddr
    ) public restriction {
        Request storage newRequest = requests.push();
        newRequest.description = desc;
        newRequest.value = val;
        newRequest.recipient = toAddr;
        newRequest.completed = false;
        newRequest.yesVotes = 0;
        //  when initialising a struct we have to initialise only the value types and
        //  the reference types not necessarily be initialised.
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);

        Request storage request = requests[index];
        require(!request.hasVoted[msg.sender]);

        request.hasVoted[msg.sender] = true;
        request.yesVotes++;
    }

    function finaliseRequest(uint index) public restriction {
        Request storage request = requests[index];

        require(!request.completed);
        require(request.yesVotes > (approversCount / 2));

        payable(request.recipient).transfer(request.value);

        request.completed = true;
    }

    function getSummary()
        public
        view
        returns (
            uint,
            uint,
            uint,
            uint,
            uint,
            address,
            string memory,
            string memory,
            string memory,
            uint
        )
    {
        return (
            minContribution,
            premiumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            campaignName,
            campaignDesc,
            managerName,
            premiumContributors.length
        );
    }

    function getRequest() public view returns (uint) {
        return requests.length;
    }
}

contract WalletFactory {
    mapping(address => address payable) private walletAddress;

    function createWallet() public returns (address payable) {
        require(
            walletAddress[msg.sender] == address(0),
            "Sender already has a wallet..."
        );
        walletAddress[msg.sender] = payable(
            address(new Wallet(payable(msg.sender)))
        );
        return walletAddress[msg.sender];
    }

    function getCampaignAddr() public view returns (address payable) {
        if (walletAddress[msg.sender] != address(0)) {
            return walletAddress[msg.sender];
        } else {
            return payable(address(0));
        }
    }
}

contract Wallet {
    address payable public immutable manager;
    uint256 transactionCount;

    constructor(address payable creator) {
        manager = creator;
    }

    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp
    );

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
    }

    TransferStruct[] transactions;

    function addToBlockchain(
        address payable receiver,
        uint amount,
        string memory message
    ) public {
        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp
            )
        );

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp);
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
